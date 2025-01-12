"use client";

import { Carta } from "@prisma/client";
import MazoCartaRow from "./MazoCartaRow";

export interface CartaCantidad extends Carta {
    cantidad: number;
}

export function MazoSection({ nombre, sectionKey, section, bovedaPuntos, onPlusClick, onMinusClick, onSideboardClick }: {
    nombre: string,
    sectionKey: string, 
    section: Carta[],
    bovedaPuntos?: number
    onPlusClick?: (carta: CartaCantidad) => void,
    onMinusClick?: (carta: CartaCantidad) => void
    onSideboardClick?: (carta: Carta, fromSection: string) => void
}) {

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
    return (
        <>
            <div className="flex pb-4">
                <h4 className="text-2xl font-bold dark:text-white flex-grow">{nombre}</h4>
                {sectionKey === 'boveda' && <span className="me-1 content-center text-md rounded bg-gray-200 mt-1.5 px-2.5 py-0.5 font-medium text-white shadow-xl dark:text-gray-700 dark:shadow-xl dark:shadow-gray-800">{bovedaPuntos}P</span>}
                <span className="content-center text-md rounded bg-yellow-300 mt-1.5 px-2.5 py-0.5 font-medium text-white shadow-xl dark:text-gray-700 dark:shadow-xl dark:shadow-gray-800">{section.length}</span>
            </div>
            <div className="grid gap-1">
                {sectionReduced.length > 0 ? (
                    sectionReduced.map((carta) => (
                        <div className="" key={carta.id}>
                            <MazoCartaRow carta={carta} onPlusClick={onPlusClick} onMinusClick={onMinusClick} onSideboardClick={onSideboardClick} section={sectionKey} />
                        </div>
                    ))
                ) : (
                    <p>No hay cartas en esta sección.</p>
                )}
            </div>
        </>
    );
}