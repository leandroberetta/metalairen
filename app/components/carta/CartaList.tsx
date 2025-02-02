"use client";

import { Carta } from "@prisma/client";
import React from "react";

export default function CardsList({ cartas, onCartaClick }: { cartas: Carta[], onCartaClick?: (carta: Carta) => void }) {
    return (
        <div className="mx-auto">
            {cartas.length > 0 &&
                <h1 className="text-xl md:text-3xl font-extrabold dark:text-white flex-grow pb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-yellow-300">Resultados de la búsqueda ({cartas.length})</span>
                </h1>
            }
            {cartas.length > 0 && <div className="grid grid-cols-2 justify-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
                {cartas.map((carta) => (
                    <div key={carta.id} onClick={() => onCartaClick && onCartaClick(carta)} className="inline-block transition ease-in-out hover:scale-110 cursor-pointer">
                        <img
                            src={carta.imagen}
                            alt={`Card ${carta.id}`}
                            className="rounded-xl shadow dark:shadow dark:shadow-gray-800"
                        />
                    </div>
                ))}
            </div>
            }
        </div>
    );
}