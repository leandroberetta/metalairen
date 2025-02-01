import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import MazoFilters from "../components/mazo/MazoFilters";
import TusMazosPage from "../components/mazo/TusMazosPage";
import { auth } from "@/auth";
import MazosPublicos from "../components/mazo/MazosCompartidos";

export default async function Mazos() {
  const session = await auth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="p-4 pt-0">
        <div className="pb-4">
          <SearchBar filters={<MazoFilters />} />
        </div>
        {session &&
          <div className="pb-8">
            <TusMazosPage />
          </div>
        }
        <div>
          <MazosPublicos />
        </div>
      </div>
    </Suspense>
  );
}