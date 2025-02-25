"use server";

import { auth, signIn } from "@/auth";
import { MazoTemporal } from "./components/mazo/MazoBuilder";
import { prisma } from "./db/prisma";
import { CartaCantidad } from "./components/mazo/MazoSection";

export async function formAction() {
  await signIn("google")
}

export async function handleEliminarMazo(id: number): Promise<{ error?: string }> {
  const session = await auth();

  try {
    if (session && session.user && session.user.email) {
      const usuario = await prisma.usuario.findFirst({
        where: { email: session.user.email },
      });

      if (!usuario) {
        return { error: "Usuario no encontrado." };
      }

      const mazo = await prisma.mazo.findUnique({
        where: { id },
      });

      if (!mazo) {
        return { error: "Mazo no encontrado." };
      }

      if (mazo.usuarioId !== usuario.id) {
        return { error: "No tienes permisos para eliminar este mazo." };
      }

      await prisma.mazoCarta.deleteMany({
        where: { mazoId: id },
      });

      await prisma.mazo.delete({
        where: { id },
      });

      return {};
    } else {
      return { error: "No se pudo autenticar la sesión." };
    }
  } catch (err) {
    console.error("Error al eliminar el mazo:", err);
    return { error: (err as Error).message || "Error desconocido." };
  }
}

export async function handleGuardarMazo(
  mazo: MazoTemporal,
  nombre: string,
  subtipo1: string,
  subtipo2: string,
  publico: boolean,
  formato: string,
  id?: number
): Promise<{ mazoId?: number; error?: string }> {
  const session = await auth();

  try {
    if (session && session.user && session.user.email) {
      const usuario = await prisma.usuario.findFirst({
        where: { email: session.user.email },
      });

      if (!usuario) {
        return { error: "Usuario no encontrado." };
      }

      const reinoReduced = Object.values(
        mazo.reino.reduce((acc: Record<number, CartaCantidad>, carta) => {
          if (acc[carta.id]) {
            acc[carta.id].cantidad++;
          } else {
            acc[carta.id] = { ...carta, cantidad: 1 };
          }
          return acc;
        }, {})
      );

      const sideboardReduced = Object.values(
        mazo.sideboard.reduce((acc: Record<number, CartaCantidad>, carta) => {
          if (acc[carta.id]) {
            acc[carta.id].cantidad++;
          } else {
            acc[carta.id] = { ...carta, cantidad: 1 };
          }
          return acc;
        }, {})
      );

      const bovedaReduced = Object.values(
        mazo.boveda.reduce((acc: Record<number, CartaCantidad>, carta) => {
          if (acc[carta.id]) {
            acc[carta.id].cantidad++;
          } else {
            acc[carta.id] = { ...carta, cantidad: 1 };
          }
          return acc;
        }, {})
      );

      const mazoId = await prisma.$transaction(async (prisma) => {
        let mazoId: number;

        if (id) {
          const existingMazo = await prisma.mazo.findUnique({
            where: { id },
          });

          if (!existingMazo) {
            throw new Error("El mazo no existe.");
          }

          await prisma.mazo.update({
            where: { id },
            data: {
              nombre,
              usuarioId: usuario.id,
              publico: publico || false,
              subtipo1,
              subtipo2,
              formato
            },
          });

          await prisma.mazoCarta.deleteMany({
            where: { mazoId: id },
          });

          mazoId = id;
        } else {
          const newMazo = await prisma.mazo.create({
            data: {
              nombre,
              usuarioId: usuario.id,
              publico: publico || false,
              subtipo1,
              subtipo2,
              formato
            },
          });

          mazoId = newMazo.id;
        }

        const cartas = [
          ...reinoReduced.map((carta) => ({
            mazoId,
            cartaId: carta.id,
            seccion: "reino",
            cantidad: carta.cantidad,
          })),
          ...bovedaReduced.map((carta) => ({
            mazoId,
            cartaId: carta.id,
            seccion: "boveda",
            cantidad: carta.cantidad,
          })),
          ...sideboardReduced.map((carta) => ({
            mazoId,
            cartaId: carta.id,
            seccion: "sidedeck",
            cantidad: carta.cantidad,
          })),
        ];

        await prisma.mazoCarta.createMany({
          data: cartas,
        });

        return mazoId;
      });

      return { mazoId };
    } else {
      return { error: "No se pudo autenticar la sesión." };
    }
  } catch (err) {
    console.error("Error al guardar el mazo:", err);
    return { error: (err as Error).message || "Error desconocido." };
  }
}

