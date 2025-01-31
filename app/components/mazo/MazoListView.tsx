"use client";

import { MazoSection } from "./MazoSection";
import { MazoTemporal } from "./MazoBuilder";
import MazoCostesChart from "./MazoCostesChart";
import { useSession } from "next-auth/react";
import { Tooltip } from "flowbite-react";

export default function MazoGridView({ mazo, subtipo1, subtipo2, nombre, bovedaPuntos, onDownloadClick, onExportClick }: {
    mazo: MazoTemporal,
    subtipo1?: string | null,
    subtipo2?: string | null,
    nombre?: string | null,
    bovedaPuntos?: number,
    onDownloadClick?: () => void,
    onExportClick?: () => void
}) {
    const session = useSession();
    return (
        <div>
            <div className="flex flex-col md:flex-row mt-4">
                <div className="flex flex-row grow">
                    <h1 className="text-3xl font-extrabold dark:text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-yellow-300">{nombre}</span>
                    </h1>
                </div>
                <div>
                    <div className="flex flex-row mt-4">
                        <h2 className="text-xl dark:text-white font-extrabold text-gray-900 grow">
                            {subtipo1 && subtipo2 && `${subtipo1} / ${subtipo2}`}
                        </h2>
                        {session.data?.user && (
                            <div className="flex flex-row">
                                <Tooltip content="Descargar lista">
                                    <button onClick={() => onDownloadClick && onDownloadClick()} type="button" className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5 me-2">
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
                        )}
                    </div>
                    <div className="my-4">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Dominación</span>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="my-4 mt-0 h-full">
                    <MazoCostesChart mazo={mazo} />
                </div>

            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="">
                    <MazoSection nombre="Reino" sectionKey="reino" section={mazo.reino} viewMode={true} />
                </div>
                <div className="">
                    <MazoSection nombre="Bóveda" sectionKey="boveda" section={mazo.boveda} viewMode={true} bovedaPuntos={bovedaPuntos} />
                </div>
                <div className="">
                    <MazoSection nombre="Sidedeck" sectionKey="sidedeck" section={mazo.sideboard} viewMode={true} />
                </div>
            </div>

        </div >
    );

}