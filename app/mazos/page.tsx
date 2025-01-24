import { prisma } from "../db/prisma";
import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import MazoFilters from "../components/mazo/MazoFilters";
import TusMazosPage from "../components/mazo/TusMazosPage";
import { auth } from "@/auth";
import CrearMazoButton from "../components/mazo/CrearMazoButton";
import MazosPublicos from "../components/mazo/MazosCompartidos";

export default async function Mazos() {
  const session = await auth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="p-4">
        <div className="pb-4">
          <SearchBar filters={<MazoFilters />} />
        </div>
        <div>
          {session && <TusMazosPage />}
        </div>
        <div className="mt-8">
          <MazosPublicos />
        </div>
      </div>
    </Suspense>
  );
}