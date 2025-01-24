"use server";

import { auth, signIn } from "@/auth";
import { MazoTemporal } from "./components/mazo/MazoBuilder";
import { prisma } from "./db/prisma";
import { CartaCantidad } from "./components/mazo/MazoSection";

export async function formAction() {
  await signIn("google")
}

export async function handleGuardarMazo(mazo: MazoTemporal, nombre: string, subtipo1: string, subtipo2: string, publico: boolean) {
  console.log("guardar mazo2");
  const session = await auth();
  if (session && session.user && session.user.email) {
    const usuario = await prisma.usuario.findFirst({
      where: { email: session.user.email },
    });
    if (usuario) {
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
      // Iniciar la transacción
      const result = await prisma.$transaction(async (prisma) => {
        // Crear el mazo
        const mazo = await prisma.mazo.create({
          data: {
            nombre,
            usuarioId: usuario.id,
            publico: publico || false,
            subtipo1,
            subtipo2,
          },
        });
        // Asociar las cartas al mazo
        const reinoCartas = reinoReduced.map((carta) => ({
          mazoId: mazo.id,
          cartaId: carta.id,
          seccion: "reino",
          cantidad: carta.cantidad,
        }));

        const bovedaCartas = reinoReduced.map((carta) => ({
          mazoId: mazo.id,
          cartaId: carta.id,
          seccion: "boveda",
          cantidad: carta.cantidad,
        }));

        const sidedeckCartas = reinoReduced.map((carta) => ({
          mazoId: mazo.id,
          cartaId: carta.id,
          seccion: "sidedeck",
          cantidad: carta.cantidad,
        }));

        await prisma.mazoCarta.createMany({
          data: [...reinoCartas, ...bovedaCartas, ...sidedeckCartas],
        });
      });
    }
  }
}