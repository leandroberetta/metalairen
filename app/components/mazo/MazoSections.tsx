"use client";

import { MazoSection } from "./MazoSection";
import { MazoTemporal } from "./MazoBuilder";
import { Carta } from "@prisma/client";
import { useState } from "react";
import clsx from "clsx";
import Select from "../Select";
import { Tooltip } from "flowbite-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import MazoCostesChart from "./MazoCostesChart";

export function MazoSections({ mazo, onPlusClick, onMinusClick, onSideboardClick, onImportClick, onExportClick, onDownloadClick, validationErrors, bovedaPuntos }: {
    mazo: MazoTemporal, onPlusClick: (carta: Carta) => void,
    onMinusClick: (carta: Carta) => void,
    onSideboardClick: (carta: Carta, fromSection: string) => void
    onImportClick: () => void,
    onExportClick: () => void,
    onDownloadClick: () => void,
    validationErrors: string[]
    bovedaPuntos?: number,
}) {
    const [mostrarChart, setMostrarChart] = useState(false);
    const searchParams = useSearchParams();
    const currentQueryParams = Object.fromEntries(searchParams.entries());
    return (
        <div className="grid gap-4 sticky top-4 max-h-screen overflow-auto scrollbar-hide pb-10">
            <div className="flex flex-col md:flex-row">
                <h1 className="text-3xl font-extrabold dark:text-white flex-grow">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-yellow-300">Mazo</span>
                </h1>
                <div className="flex mt-4 md:mt-0">
                    <Tooltip content="Ver mazo">
                        <Link
                            href={{
                                pathname: '/mazo/ver',
                                query: { ...currentQueryParams }
                            }}
                            className="inline-flex items-center justify-center focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5 me-2"
                        >
                            <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                        </Link>
                    </Tooltip>
                    <Tooltip content="Ver composisión del reino por costes">
                        <button onClick={() => setMostrarChart(!mostrarChart)} type="button" className={clsx("focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5 me-2", { "dark:bg-yellow-400": mostrarChart })}>
                            <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v15a1 1 0 0 0 1 1h15M8 16l2.5-5.5 3 3L17.273 7 20 9.667" />
                            </svg>
                        </button>
                    </Tooltip>
                    <Tooltip content="Descargar lista">
                        <button onClick={() => onDownloadClick && onDownloadClick()} type="button" className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5 me-2">
                            <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" />
                            </svg>
                        </button>
                    </Tooltip>
                    <Tooltip content="Copiar lista al porta papeles">
                        <button onClick={() => onExportClick && onExportClick()} type="button" className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5 me-2">
                            <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z" />
                            </svg>
                        </button>
                    </Tooltip>
                    <Tooltip content="Importar lista desde el porta papeles">
                        <button onClick={() => onImportClick && onImportClick()} type="button" className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5">
                            <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2" />
                            </svg>
                        </button>
                    </Tooltip>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="cols-span-1">
                    <Select options={{
                        "ANIMAL": "Animal",
                        "BRUJA": "Bruja",
                        "DEMONIO": "Demonio",
                        "DESERTOR": "Desertor",
                        "DJINN": "Djinn",
                        "DRAGON": "Dragón",
                        "ELEMENTAL": "Elemental",
                        "ENANO": "Enano",
                        "ETERNO": "Eterno",
                        "GIGANTE": "Gigante",
                        "INSECTO": "Insecto",
                        "MAGO": "Mago",
                        "MIMETICO": "Mimético",
                        "MONJE": "Monje",
                        "PIRATA": "Pirata",
                        "SOLDADO": "Soldado",
                    }} label={"Subtipo"} parameter={"subtipo1"} allowMultipleSelections={false} />
                </div>
                <div className="cols-span-1">
                    <Select options={{
                        "ANIMAL": "Animal",
                        "BRUJA": "Bruja",
                        "DEMONIO": "Demonio",
                        "DESERTOR": "Desertor",
                        "DJINN": "Djinn",
                        "DRAGON": "Dragón",
                        "ELEMENTAL": "Elemental",
                        "ENANO": "Enano",
                        "ETERNO": "Eterno",
                        "GIGANTE": "Gigante",
                        "INSECTO": "Insecto",
                        "MAGO": "Mago",
                        "MIMETICO": "Mimético",
                        "MONJE": "Monje",
                        "PIRATA": "Pirata",
                        "SOLDADO": "Soldado",
                    }} label={"Subtipo"} parameter={"subtipo2"} allowMultipleSelections={false} />
                </div>
            </div>
            <div>
                {validationErrors && validationErrors.length > 0 &&
                    <div className="flex p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:shadow-xl" role="alert">
                        <div>
                            <span className="font-medium">Errores de validación:</span>
                            <ul className="mt-1.5 list-disc list-inside">
                                {validationErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>}
            </div>
            {mostrarChart && <MazoCostesChart mazo={mazo} />}
            <div>
                <MazoSection nombre="Reino" sectionKey="reino" section={mazo.reino} onPlusClick={onPlusClick} onMinusClick={onMinusClick} onSideboardClick={onSideboardClick} />
            </div>
            <div>
                <MazoSection nombre="Sidedeck" sectionKey="sidedeck" section={mazo.sideboard} onSideboardClick={onSideboardClick} />
            </div>
            <div>
                <MazoSection nombre="Bóveda" sectionKey="boveda" section={mazo.boveda} onPlusClick={onPlusClick} onMinusClick={onMinusClick} bovedaPuntos={bovedaPuntos} />
            </div>
        </div>
    );
}