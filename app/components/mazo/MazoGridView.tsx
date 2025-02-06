"use client";

import { Carta } from "@prisma/client";
import { MazoTemporal } from "./MazoBuilder";
import MazoReinoCartaGrid from "./MazoReinoCartaGrid";
import MazoBovedaCartaGrid from "./MazoBovedaCartaGrid";
import MazoSideboardCartaGrid from "./MazoSideboardCartaGrid";
import MazoTiposChart from "./MazoTiposChart";
import MazoCostesChart from "./MazoCostesChart";
import { Tooltip } from "flowbite-react";

const reduceSection = (cartas: Carta[]): (Carta & { cantidad: number })[] => {
    return Object.values(
        cartas.reduce((acc: Record<number, Carta & { cantidad: number }>, carta) => {
            if (acc[carta.id]) {
                acc[carta.id].cantidad++;
            } else {
                acc[carta.id] = { ...carta, cantidad: 1 };
            }
            return acc;
        }, {})
    ).sort((a, b) => a.coste - b.coste);
};

export default function MazoGridView({ mazo, subtipo1, subtipo2, nombre, bovedaPuntos, onDownloadClick, onExportClick }: {
    mazo: MazoTemporal,
    subtipo1?: string | null,
    subtipo2?: string | null,
    nombre?: string | null,
    bovedaPuntos?: number,
    onDownloadClick?: () => void,
    onExportClick?: () => void
}) {
    const reinoReduced = reduceSection(mazo.reino);
    const sideboardReduced = reduceSection(mazo.sideboard);
    const bovedaReduced = reduceSection(mazo.boveda);
    return (
        <div className="">
            <div className="flex flex-col sm:flex-row">
                <div className="grow">
                    <div className="flex">
                        <h1 className="grow mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                                {nombre}
                            </span>
                        </h1>
                    </div>
                    <div>
                        <h2 className="text-xl dark:text-white font-extrabold text-gray-900">
                            {subtipo1 && subtipo2 && `${subtipo1} / ${subtipo2}`}
                        </h2>
                    </div>
                    <div className="mt-4">
                        <span className="bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Dominación</span>
                    </div>
                    
                </div>
                <div className="flex">
                    <div className="">
                        <MazoCostesChart mazo={mazo} />
                    </div>
                    <div className="flex items-center">
                        <MazoTiposChart mazo={mazo} />
                    </div>
                    <div className="content-center">
                        <Tooltip content="Descargar lista">
                            <button onClick={() => onDownloadClick && onDownloadClick()} type="button" className="mb-2 focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5">
                                <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" />
                                </svg>
                            </button>
                        </Tooltip>
                        <Tooltip content="Copiar lista al porta papeles">
                            <button onClick={() => onExportClick && onExportClick()} type="button" className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5">
                                <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-8 gap-4 mt-4">
                <div className="col-span-4">
                    <MazoReinoCartaGrid cartas={reinoReduced} />
                </div>
                <div className="col-span-3">
                    <MazoBovedaCartaGrid cartas={bovedaReduced} bovedaPuntos={bovedaPuntos} />
                </div>
                <div className="">
                    <MazoSideboardCartaGrid cartas={sideboardReduced} />
                </div>
            </div>
        </div>
    );
}