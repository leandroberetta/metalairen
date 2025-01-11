import { prisma } from "./db/prisma";
import { Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartaSearch from "./components/CartaSearch";
import SearchBar from "./components/SearchBar";
import CartaFilters from "./components/CartaFilters";

export default async function Cartas() {
  const cartas = await prisma.carta.findMany();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="p-4">
        <div className="pb-4">
            <SearchBar filters={CartaFilters()} />
        </div>
        <CartaSearch cartas={cartas} />
      </div>
    </Suspense>
  );
}
