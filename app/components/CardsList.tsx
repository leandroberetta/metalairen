"use client";

import React from "react";
import { Card } from "../db/prisma";

export default function CardsList({ cards }: { cards: Card[] }) {
    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 justify-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {cards.map((card) => (
                    <div key={card.id} className="relative inline-block transition ease-in-out hover:scale-110">
                        <img
                            src={card.imagen}
                            alt={`Card ${card.id}`}
                            className="rounded-xl shadow-xl dark:shadow-xl dark:shadow-gray-800"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}