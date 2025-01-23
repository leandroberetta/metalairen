"use client";

import { useState } from "react";
import { Carta } from "@prisma/client";
import MazoCartaItem from "./MazoCartaItem";

export default function MazoBovedaCartaGrid({ cartas, bovedaPuntos }: { cartas: (Carta & { cantidad: number })[], bovedaPuntos?: number }) {
    const [selectedCard, setSelectedCard] = useState<Carta | null>(null);

    const closeModal = () => setSelectedCard(null);

    const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    return (
        <div>
            <div className="flex">
                <div className="grow">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bóveda</h5>
                </div>
                <span className="m-2 content-center text-md rounded bg-gray-200 mt-1.5 px-2.5 py-0.5 font-medium text-white shadow-xl dark:text-gray-700 dark:shadow-xl dark:shadow-gray-800">{bovedaPuntos}P</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }, (_, colIndex) => (
                    <div key={colIndex} className="relative h-[400px]">
                        {cartas
                            .filter((_, index) => index % 3 === colIndex)
                            .map((carta, index) => (
                                <button key={carta.id} type="button" onClick={() => setSelectedCard(carta)}>
                                    <div style={{ top: `${index * 80}px` }} className="absolute">
                                        <MazoCartaItem carta={carta} cantidad={carta.cantidad} />
                                    </div>
                                </button>
                            ))}
                    </div>
                ))}
                <div style={{ height: `${cartas.filter((_, index) => index % 3 === 1).length * 30}px` }} />

            </div>
            {selectedCard && (
                <div
                    id="modal-boveda"
                    tabIndex={-1}
                    className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-900 bg-opacity-50 backdrop-blur-sm"
                    aria-hidden="true"
                    onClick={handleBackgroundClick}>
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
                </div>
            )}
        </div>
    );
}
