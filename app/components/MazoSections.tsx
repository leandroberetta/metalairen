"use client";

import { MazoSection } from "./MazoSection";
import { Mazo } from "./MazoBuilder";
import { Carta } from "@prisma/client";

export function MazoSections({ mazo, onPlusClick, onMinusClick, onSideboardClick, onImportClick }: {
    mazo: Mazo, onPlusClick: (carta: Carta) => void,
    onMinusClick: (carta: Carta) => void,
    onSideboardClick: (carta: Carta, fromSection: string) => void
    onImportClick: () => void
}) {
    return (
        <div className="grid gap-4 sticky top-4">
            <div className="flex">
                <h1 className="text-3xl font-extrabold dark:text-white flex-grow">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-yellow-300">Mazo</span>
                </h1>
                <button type="button" className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded-lg text-sm px-2.5 py-2.5 me-2">
                    <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z" />
                    </svg>

                </button>
                <button onClick={() => onImportClick && onImportClick()} type="button" className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded-lg text-sm px-2.5 py-2.5">
                    <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2" />
                    </svg>
                </button>
            </div>
            <div>
                <MazoSection nombre="Reino" sectionKey="reino" section={mazo.reino} onPlusClick={onPlusClick} onMinusClick={onMinusClick} onSideboardClick={onSideboardClick} />
            </div>
            <div>
                <MazoSection nombre="Sidedeck" sectionKey="sidedeck" section={mazo.sideboard} onSideboardClick={onSideboardClick} />
            </div>
            <div>
                <MazoSection nombre="Bóveda" sectionKey="boveda" section={mazo.boveda} onMinusClick={onMinusClick} />
            </div>
        </div>
    );
}