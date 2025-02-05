"use client";

import { Carta } from "@prisma/client";
import MazoCartaRow from "./MazoCartaRow";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Tooltip } from "flowbite-react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

export interface CartaCantidad extends Carta {
    cantidad: number;
}

export function MazoSection({ nombre, sectionKey, section, bovedaPuntos, onPlusClick, onMinusClick, onSideboardClick, viewMode }: {
    nombre: string,
    sectionKey: string,
    section: Carta[],
    bovedaPuntos?: number
    onPlusClick?: (carta: CartaCantidad, section: string) => void,
    onMinusClick?: (carta: CartaCantidad, section: string) => void
    onSideboardClick?: (carta: CartaCantidad, fromSection: string) => void
    viewMode?: boolean
}) {
    const [selectedCard, setSelectedCard] = useState<Carta | null>(null);
    const [ordenarDesc, setOrdernarDesc] = useState<boolean>(true);
    const closeModal = () => setSelectedCard(null);
    const searchParams = useSearchParams();
    const [sect, setSection] = useState<CartaCantidad[]>([]);

    useEffect(() => {
        const sectionReduced = Object.values(
            section.reduce((acc: Record<number, CartaCantidad>, carta) => {
                if (acc[carta.id]) {
                    acc[carta.id].cantidad++;
                } else {
                    acc[carta.id] = { ...carta, cantidad: 1 };
                }
                return acc;
            }, {})
        );

        const order = searchParams.get('ordenar' + sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1));
        setSection([...sectionReduced].sort((a, b) => (order === 'desc' ? b.coste - a.coste : a.coste - b.coste)));
    }, [section, searchParams]);

    const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    useEffect(() => {
        const order = searchParams.get('ordenar' + sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1));
        const queryString = new URLSearchParams(searchParams as ReadonlyURLSearchParams);
        if (order === 'asc') {
            queryString.delete('ordenar' + sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1));
            queryString.set('ordenar' + sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1), 'desc');
            window.history.replaceState(null, '', `?${queryString.toString()}`);
        } else if (order === 'desc') {
            queryString.delete('ordenar' + sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1));
            queryString.set('ordenar' + sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1), 'asc');
            window.history.replaceState(null, '', `?${queryString.toString()}`);
        }
    }, [ordenarDesc]);

    return (
        <>
            <div className="flex pb-4">
                <div className="grow flex flex-row items-center">
                    <h4 className="text-2xl font-bold dark:text-white">{nombre}</h4>
                    {!viewMode &&
                        <Tooltip content={sectionKey === 'boveda' ? "Ordenar por puntos" : "Ordenar por coste"}>
                            {ordenarDesc ? (
                                <button onClick={() => setOrdernarDesc(false)} type="button" className="focus:outline-none dark:bg-gray-900 font-medium rounded text-sm px-2.5 py-2.5 me-2">
                                    <svg className="w-6 h-6 dark:text-yellow-300 dark:hover:text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v13m0-13 4 4m-4-4-4 4" />
                                    </svg>
                                </button>
                            ) : (
                                <button onClick={() => setOrdernarDesc(true)} type="button" className="focus:outline-none dark:bg-gray-900 font-medium rounded text-sm px-2.5 py-2.5 me-2">
                                    <svg className="w-6 h-6 dark:text-yellow-300 dark:hover:text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 14-4-4m4 4 4-4" />
                                    </svg>
                                </button>
                            )}
                        </Tooltip>}
                </div>
                {sectionKey === 'boveda' && <span className="me-1 content-center text-md rounded bg-gray-200 mt-1.5 px-2.5 py-0.5 font-medium text-white shadow dark:text-gray-700 dark:shadow dark:shadow-gray-800">{bovedaPuntos}P</span>}
                <span className="content-center text-md rounded bg-yellow-300 mt-1.5 px-2.5 py-0.5 font-medium text-white shadow dark:text-gray-700 dark:shadow dark:shadow-gray-800">{section.length}</span>
            </div>
            <div className="grid gap-1">
                {sect.length > 0 ? (
                    sect.map((carta) => (
                        <div className="" key={carta.id}>
                            <MazoCartaRow carta={carta} onPlusClick={onPlusClick} onMinusClick={onMinusClick} onSideboardClick={onSideboardClick} section={sectionKey} viewMode={viewMode} onCartaClick={setSelectedCard} />
                        </div>
                    ))
                ) : (
                    <p>No hay cartas en esta sección.</p>
                )}
            </div>
            {selectedCard && ReactDOM.createPortal(
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
                                    {selectedCard.nombre}
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
                                <img src={selectedCard.imagen} alt={selectedCard.nombre} className="rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}