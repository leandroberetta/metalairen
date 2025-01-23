import { Suspense } from "react";
import { prisma } from "../db/prisma";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import TorneoSearch from "../components/torneo/TorneoSearch";
import TorneoFilters from "../components/torneo/TorneoFilters";

export default async function Torneos() {
  const torneos = await prisma.torneo.findMany({
    orderBy: {
      fecha: 'desc',
    },
  });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="p-4">
        <div className="pb-4">
          <SearchBar filters={TorneoFilters()} />
        </div>
        <h1 className="mb-8 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
          <span
            className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
            Torneos
          </span>
        </h1>
        <TorneoSearch torneos={torneos} />
      </div>
    </Suspense>
  );
}