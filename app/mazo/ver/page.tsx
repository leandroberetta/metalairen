import LoadingSpinner from "@/app/components/LoadingSpinner";
import MazoViewer from "@/app/components/mazo/MazoViewer";
import { prisma } from "@/app/db/prisma";
import { Suspense } from "react";

export default async function MazosView() {
  const cartas = await prisma.carta.findMany({});

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MazoViewer cartas={cartas} />
    </Suspense>
  );
}