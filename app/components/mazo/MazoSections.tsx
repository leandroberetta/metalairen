"use client";

import { MazoSection } from "./MazoSection";
import { MazoTemporal } from "./MazoBuilder";
import { Carta } from "@prisma/client";
import React, { useEffect } from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

export function MazoSections({ mazo, onPlusClick, onMinusClick, onSideboardClick, bovedaPuntos }: {
    mazo: MazoTemporal,
    onPlusClick: (carta: Carta, section: string) => void,
    onMinusClick: (carta: Carta, section: string) => void,
    onSideboardClick: (carta: Carta, fromSection: string) => void,
    onOrdenarReinoClick?: (direction: string) => void,
    onOrdenarSideboardClick?: (direction: string) => void,
    onOrdenarBovedaClick?: (direction: string) => void,
    bovedaPuntos?: number,
}) {
    const searchParams = useSearchParams();
    useEffect(() => {
        console.log("agrego los orders");
        const orderReino = searchParams.get('ordenarReino');
        const queryString = new URLSearchParams(searchParams as ReadonlyURLSearchParams);
        if (orderReino == null) {
            queryString.set('ordenarReino', 'asc');
        }
        const orderSideboard = searchParams.get('ordenarSidedeck');
        if (orderSideboard == null) {
            queryString.set('ordenarSidedeck', 'asc');
        }
        const orderBoveda = searchParams.get('ordenarBoveda');
        if (orderBoveda == null) {
            queryString.set('ordenarBoveda', 'asc');
        }
        window.history.replaceState(null, '', `?${queryString.toString()}`);
    }, []);
    
    return (
        <div className="grid gap-4">
            <div>
                <MazoSection nombre="Reino" sectionKey="reino" section={mazo.reino} onPlusClick={onPlusClick} onMinusClick={onMinusClick} onSideboardClick={onSideboardClick} />
            </div>
            <div>
                <MazoSection nombre="Sidedeck" sectionKey="sidedeck" section={mazo.sideboard} onSideboardClick={onSideboardClick} onPlusClick={onPlusClick} onMinusClick={onMinusClick} />
            </div>
            <div>
                <MazoSection nombre="Bóveda" sectionKey="boveda" section={mazo.boveda} onPlusClick={onPlusClick} onMinusClick={onMinusClick} bovedaPuntos={bovedaPuntos} />
            </div>
        </div>
    );
}