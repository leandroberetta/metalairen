import { prisma } from "../db/prisma";
import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import MazoSearch from "../components/mazo/MazoSearch";
import MazoFilters from "../components/mazo/MazoFilters";
import { Tooltip } from "flowbite-react";
import Link from "next/link";

export default async function Mazos() {
  const mazos = await prisma.mazo.findMany({ include: { cartas: true }, orderBy: { id: 'desc' } });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="p-4">
        <div className="pb-4">
          <SearchBar filters={<MazoFilters />} />
        </div>
        <div className="flex flex-row">
          <div className="grow">
            <h1 className="mb-8 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                Mazos
              </span>
            </h1>
          </div>
          <div className="h-full">
            <Tooltip content="Construir mazo">
              <Link
                href={{
                  pathname: '/mazo/crear',
                }}
                className="inline-flex items-center justify-center focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5"
              >
                <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                </svg>
              </Link>
            </Tooltip>
          </div>

        </div>
        <MazoSearch mazos={mazos} />
      </div>
    </Suspense >
  );
}