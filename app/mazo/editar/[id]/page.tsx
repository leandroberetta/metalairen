import { handleEliminarMazo, handleGuardarMazo } from "@/app/backend";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import MazoBuilder from "@/app/components/mazo/MazoBuilder";
import MazoError from "@/app/components/mazo/MazoError";
import { prisma } from "@/app/db/prisma";
import { buildMazo } from "@/app/util/mazoUtil";
import { auth } from "@/auth";
import { Suspense } from "react";

export default async function EditarMazo({ params }: { params: Promise<{ id: string }> }) {
  const cartas = await prisma.carta.findMany();
  const mazo = await prisma.mazo.findUnique({ where: { id: parseInt((await params).id) }, include: { cartas: true } });
  
  if (!mazo) {
    return <MazoError />;
  }
  
  if (!mazo.publico) {
    const session = await auth();
    const email = session?.user?.email;
  
    if (!email) {
      return <MazoError />;
    }
  
    const usuario = await prisma.usuario.findFirst({ where: { email: email } });
  
    if (usuario && usuario.id !== mazo.usuarioId) {
      return <MazoError />;
    }
  }

  const mazoTmp = await buildMazo(mazo);
  
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <MazoBuilder id={parseInt((await params).id)} cartas={cartas} mazoGuardado={mazoTmp} subtipo1Guardado={mazo.subtipo1} subtipo2Guardado={mazo.subtipo2} nombreGuardado={mazo.nombre} publicoGuardado={mazo.publico} formatoGuardado={mazo.formato} onGuardarMazo={handleGuardarMazo} onEliminarMazo={handleEliminarMazo} />
      </Suspense>
    </>
  );
}
