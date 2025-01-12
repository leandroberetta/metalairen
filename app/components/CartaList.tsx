"use client";

import { Carta } from "@prisma/client";
import React from "react";

export default function CardsList({ cartas, onCartaClick }: { cartas: Carta[], onCartaClick?: (carta: Carta) => void }) {
    return (
        <div className="mx-auto">
            <div className="grid grid-cols-2 justify-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {cartas.map((carta) => (
                    <div key={carta.id} onClick={() => onCartaClick && onCartaClick(carta)} className="relative inline-block transition ease-in-out hover:scale-110 cursor-pointer">
                        <img
                            src={carta.imagen}
                            alt={`Card ${carta.id}`}
                            className="rounded-xl shadow-xl dark:shadow-xl dark:shadow-gray-800"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}