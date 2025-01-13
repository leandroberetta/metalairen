import { Suspense } from "react";
import { prisma } from "../db/prisma";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import TorneoSearch from "../components/TorneoSearch";

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
            <SearchBar />
        </div>
        <TorneoSearch torneos={torneos} />
      </div>
    </Suspense>
    );
}