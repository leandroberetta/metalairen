import { Suspense } from "react";
import { prisma } from "../db/prisma";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import TorneoSearch from "../components/torneo/TorneoSearch";
import TorneoFilters from "../components/torneo/TorneoFilters";
import CrearTorneoButton from "../components/torneo/CrearTorneoButton";
import { getUserRol } from "../backend";

export default async function Torneos() {
  const torneos = await prisma.torneo.findMany({
    orderBy: {
      id: 'desc',
    },
  });

  let rol = await getUserRol();
  if (!rol) {
    rol = "jugador";
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="p-4 pt-0">
        <div className="pb-4">
          <SearchBar filters={TorneoFilters()} />
        </div>
        <div className="flex flex-row mb-4 items-start">
          <div className="grow ">
            <h1 className=" text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                Torneos
              </span>
            </h1>
          </div>
          <div className="h-full">
            <CrearTorneoButton />
          </div>
        </div>
        <TorneoSearch torneos={torneos} rol={rol}/>
      </div>
    </Suspense>
  );
}