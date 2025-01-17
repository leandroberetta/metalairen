import { prisma } from "./db/prisma";
import { Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartaSearch from "./components/CartaSearch";
import SearchBar from "./components/SearchBar";
import CartaFilters from "./components/CartaFilters";
import CartasPopulares from "./components/CartasPopulares";
import SubtiposPopularesChart from "./components/SubtiposPopularesChart";

export default async function Cartas() {
  const cartas = await prisma.carta.findMany();
  const mazos = await prisma.torneoMazo.findMany({include: {mazo: true}});  

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="p-4">
            <SearchBar filters={CartaFilters()} />
          <CartaSearch cartas={cartas} />
        </div>
      </Suspense>
      <SubtiposPopularesChart mazos={mazos.map((mazo) => mazo.mazo)} />
      <CartasPopulares section="reino" title="Cartas populares del reino" />
      <CartasPopulares section="boveda" title="Cartas populares de la bóveda" />
    </>
  );
}
