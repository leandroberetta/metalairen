import { handleGuardarMazo } from "@/app/backend";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import MazoBuilder from "@/app/components/mazo/MazoBuilder";
import { prisma } from "@/app/db/prisma";
import { Suspense } from "react";

export default async function CrearMazo() {
  const cartas = await prisma.carta.findMany();

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <MazoBuilder cartas={cartas} onGuardarMazo={handleGuardarMazo} publicoGuardado={false} />
      </Suspense>
    </>
  );
}
