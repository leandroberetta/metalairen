"use client";

import { MazoSection } from "./MazoSection";
import { MazoTemporal } from "./MazoBuilder";
import { Carta } from "@prisma/client";
import React from "react";

export function MazoSections({ mazo, onPlusClick, onMinusClick, onSideboardClick, bovedaPuntos }: {
    mazo: MazoTemporal,
    onPlusClick: (carta: Carta, section: string) => void,
    onMinusClick: (carta: Carta, section: string) => void,
    onSideboardClick: (carta: Carta, fromSection: string) => void,
    bovedaPuntos?: number,
}) {
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