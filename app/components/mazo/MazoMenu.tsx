"use client";

import clsx from "clsx";
import { Tooltip } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ReactDOM from "react-dom";

export default function MazoMenu({
    onDownloadClick,
    onExportClick,
    onImportClick,
    onGuardarMazo,
    mostrarChart,
    setMostrarChart,
    mostrarParametros,
    setMostrarParametros,
    onEliminarMazo
}: {
    onDownloadClick?: () => void,
    onExportClick?: () => void,
    onImportClick?: () => void,
    onGuardarMazo: () => void,
    mostrarChart: boolean,
    setMostrarChart: (value: boolean) => void,
    mostrarParametros: boolean,
    setMostrarParametros: (value: boolean) => void,
    onEliminarMazo: () => void
}) {
    const session = useSession();
    const searchParams = useSearchParams();
    const currentQueryParams = Object.fromEntries(searchParams.entries());
    const [mostrarEliminarMazoModal, setMostrarEliminarMazoModal] = useState(false);
    const closeModal = () => setMostrarEliminarMazoModal(false);

    const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };
    return (
        <div className="flex flex-row overflow-x-scroll scrollbar-hide">
            {session.data?.user && (
                <Tooltip content="Editar información del mazo">
                    <button onClick={() => setMostrarParametros(!mostrarParametros)} type="button" className={clsx("focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5 me-2", { "dark:bg-yellow-400": mostrarParametros })}>
                        <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                        </svg>

                    </button>
                </Tooltip>
            )}
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
            {session.data?.user && (
                <>
                    <Tooltip content="Eliminar mazo">
                        <button onClick={() => setMostrarEliminarMazoModal(true)} type="button" className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5 ms-2">
                            <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                            </svg>
                        </button>
                    </Tooltip>
                    {mostrarEliminarMazoModal && ReactDOM.createPortal(
                        <div
                            id="modal-reino"
                            tabIndex={-1}
                            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full bg-gray-900 bg-opacity-50 backdrop-blur-sm"
                            aria-hidden="true"
                            onClick={handleBackgroundClick}
                        >
                            <div className="relative w-full max-w-md max-h-full">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Atención!
                                        </h3>
                                        <button
                                            onClick={closeModal}
                                            type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-4 md:p-5 space-y-4">
                                        <p>¿Estás seguro que deseas eliminar el mazo?</p>
                                    </div>
                                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button onClick={() => onEliminarMazo()} type="button" className="text-gray-800 dark:bg-yellow-300 dark:hover:bg-yellow-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Eliminar</button>
                                        <button onClick={closeModal} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                    <Tooltip content="Guardar mazo">
                        <button onClick={() => onGuardarMazo()} type="button" className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5 ms-2">
                            <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                            </svg>

                        </button>
                    </Tooltip>
                </>
            )}
        </div>
    );
}