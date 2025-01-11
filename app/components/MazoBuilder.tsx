"use client";

import { Suspense, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import CartaSearch from "../components/CartaSearch";
import { MazoSections } from "./MazoSections";
import { Carta } from "@prisma/client";
import SearchBar from "./SearchBar";
import CartaFilters from "./CartaFilters";

export interface Mazo {
    reino: Carta[];
    boveda: Carta[];
    sideboard: Carta[];
}

export default function MazoBuilder({ cartas }: { cartas: Carta[] }) {
    const [mazo, setMazo] = useState<Mazo>({ reino: [], boveda: [], sideboard: [] });

    const handleCartaClick = (carta: Carta) => {
        console.log(carta);
        if (carta.tipo === 'TESORO') {
            setMazo((prevMazo) => ({
                ...prevMazo,
                boveda: [...prevMazo.boveda, carta],
            }));
        } else {
            setMazo((prevMazo) => ({
                ...prevMazo,
                reino: [...prevMazo.reino, carta],
            }));
        }
    }

    const handleCartaPlusClick = (carta: Carta) => {
        console.log(carta);
        if (carta.tipo !== 'TESORO') {
            setMazo((prevMazo) => ({
                ...prevMazo,
                reino: [...prevMazo.reino, carta],
            }));
        }
    }

    const handleCartaMinusClick = (carta: Carta) => {
        console.log(carta);
        if (carta.tipo !== 'TESORO') {
            setMazo((prevMazo) => {
                const index = prevMazo.reino.findIndex((c) => c.id === carta.id);
                if (index === -1) return prevMazo;

                return {
                    ...prevMazo,
                    reino: [
                        ...prevMazo.reino.slice(0, index),
                        ...prevMazo.reino.slice(index + 1),
                    ],
                };
            });
        } else {
            setMazo((prevMazo) => ({
                ...prevMazo,
                boveda: prevMazo.boveda.filter((c) => c.id !== carta.id),
            }));
        }
    }

    const handleCartaSideboardClick = (carta: Carta, fromSection: string) => {
        console.log(carta);
        if (fromSection === 'reino') {
            setMazo((prevMazo) => {
                const index = prevMazo.reino.findIndex((c) => c.id === carta.id);
                if (index === -1) return prevMazo;

                return {
                    ...prevMazo,
                    reino: [
                        ...prevMazo.reino.slice(0, index),
                        ...prevMazo.reino.slice(index + 1),
                    ],
                    sideboard: [...prevMazo.sideboard, carta]
                };
            });
        } else {
            setMazo((prevMazo) => {
                const index = prevMazo.sideboard.findIndex((c) => c.id === carta.id);
                if (index === -1) return prevMazo;

                return {
                    ...prevMazo,
                    sideboard: [
                        ...prevMazo.sideboard.slice(0, index),
                        ...prevMazo.sideboard.slice(index + 1),
                    ],
                    reino: [...prevMazo.reino, carta]
                };
            });
        }
    }

    const handleImportClick = async () => {
        const text = await navigator.clipboard.readText();
        console.log(text);
        const mazo = procesarListaMazo(text, cartas);
        console.log(mazo);
        setMazo(mazo);
    }

    function procesarListaMazo(mazo: string, cartas: Carta[]): Mazo {
        const lines = mazo.trim().split(/\r\n|\n|\r/);
        const sections: Mazo = {
            reino: [],
            boveda: [],
            sideboard: []
        };
        let currentSection: keyof Mazo | '' = '';

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('Reino:')) {
                currentSection = 'reino';
                continue;
            }

            if (trimmedLine.startsWith('Bóveda:')) {
                currentSection = 'boveda';
                continue;
            }

            if (trimmedLine.startsWith('Side Deck:')) {
                currentSection = 'sideboard';
                continue;
            }

            if (currentSection) {
                const cartasProcesadas = procesarCarta(trimmedLine, cartas);
                if (cartasProcesadas) {
                    sections[currentSection].push(...cartasProcesadas);
                }
            }
        }

        return sections;
    }

    function procesarCarta(line: string, cartas: Carta[]): Carta[] | undefined {
        const match = line.match(/(.+?)\s+x(\d+)/);
        if (match) {
            const nombre = match[1].trim();
            const cantidad = parseInt(match[2].trim(), 10);
            const carta = cartas.find((c) => c.nombre === nombre);

            if (carta) {
                // Devuelve un array con `cantidad` copias de la carta
                return Array(cantidad).fill(carta);
            }
        }
        return undefined;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <div className="p-4">
                <SearchBar filters={CartaFilters()} />
                <div className="pt-4 grid md:grid-cols-5 lg:grid-cols-3 gap-8">
                    <div className="md:col-span-2 lg:col-span-1">
                        <MazoSections
                            mazo={mazo}
                            onPlusClick={handleCartaPlusClick}
                            onMinusClick={handleCartaMinusClick}
                            onSideboardClick={handleCartaSideboardClick}
                            onImportClick={handleImportClick} />
                    </div>
                    <div className="md:col-span-3 lg:col-span-2">
                        <CartaSearch cartas={cartas} onCartaClick={handleCartaClick} />
                    </div>
                </div>
            </div>
        </Suspense>
    );
}