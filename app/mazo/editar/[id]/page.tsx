import { handleGuardarMazo } from "@/app/backend";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import MazoBuilder from "@/app/components/mazo/MazoBuilder";
import MazoError from "@/app/components/mazo/MazoError";
import { prisma } from "@/app/db/prisma";
import { buildMazo } from "@/app/util/mazoUtil";
import { Suspense } from "react";

export default async function EditarMazo({ params }: { params: Promise<{ id: string }> }) {
  const cartas = await prisma.carta.findMany();
  const mazo = await prisma.mazo.findUnique({ where: { id: parseInt((await params).id) }, include: { cartas: true } });
  if (!mazo) {
    return <MazoError />;
  }
  const mazoTmp = await buildMazo(mazo);

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <MazoBuilder cartas={cartas} mazoGuardado={mazoTmp} subtipo1Guardado={mazo.subtipo1} subtipo2Guardado={mazo.subtipo2} nombreGuardado={mazo.nombre} publico={mazo.publico} onGuardarMazo={handleGuardarMazo}/>
      </Suspense>
    </>
  );
}
