import { prisma } from "./db/prisma";
import { Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartaSearch from "./components/CartaSearch";

export default async function Home() {
  const cartas = await prisma.carta.findMany();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CartaSearch cartas={cartas} />
    </Suspense>
  );
}
