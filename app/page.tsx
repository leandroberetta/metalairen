import { prisma } from "./db/prisma";
import CardsSearch from "./components/CardsSearch";
import { Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

export default async function Home() {
  const cartas = await prisma.cartas.findMany();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CardsSearch cards={cartas} />
    </Suspense>
  );
}
