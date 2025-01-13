"use client";

import { Suspense, useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import CartaSearch from "../components/CartaSearch";
import { MazoSections } from "./MazoSections";
import { Carta } from "@prisma/client";
import SearchBar from "./SearchBar";
import CartaFilters from "./CartaFilters";
import { CartaCantidad } from "./MazoSection";
import { useSearchParams } from "next/navigation";

export interface Mazo {
    reino: Carta[];
    boveda: Carta[];
    sideboard: Carta[];
}

export default function MazoBuilder({ cartas }: { cartas: Carta[] }) {
    const [mazo, setMazo] = useState<Mazo>({ reino: [], boveda: [], sideboard: [] });
    const [bovedaPuntos, setBovedaPuntos] = useState(0);
    const [errors, setErrors] = useState<string[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        const reinoQueryParamCartas = searchParams.get('reino')?.split(';');
        const reinoCartas = reinoQueryParamCartas?.map((nombre) => cartas.find((c) => c.nombre === nombre)) as Carta[];

        const sideboardQueryParamCartas = searchParams.get('sideboard')?.split(';');
        const sideboardCartas = sideboardQueryParamCartas?.map((nombre) => cartas.find((c) => c.nombre === nombre)) as Carta[];

        const bovedaQueryParamCartas = searchParams.get('boveda')?.split(';');
        const bovedaCartas = bovedaQueryParamCartas?.map((nombre) => cartas.find((c) => c.nombre === nombre)) as Carta[];

        if (bovedaCartas) {
            const bovedaPuntos = bovedaCartas.reduce((acc, carta) => acc + carta.coste, 0);
            const tesorosGenericos = bovedaCartas.filter((c) => c.nombre === 'TESORO GENERICO').length;
            setBovedaPuntos(bovedaPuntos - tesorosGenericos);
        }

        setMazo({
            reino: reinoCartas || [],
            sideboard: sideboardCartas || [],
            boveda: bovedaCartas || []
        });
    }, [searchParams]);

    const handleCartaClick = (carta: Carta) => {
        if (carta.tipo === 'TESORO') {
            if (mazo.boveda.length < 15) {
                const cartaFound = mazo.boveda.find((c) => c.id === carta.id);
                if (!cartaFound || (cartaFound && cartaFound.nombre === 'TESORO GENERICO')) {
                    setMazo((prevMazo) => ({
                        ...prevMazo,
                        boveda: [...prevMazo.boveda, carta],
                    }));
                    if (carta.nombre === 'TESORO GENERICO') {
                        console.log("es un tesoro generico");
                        setBovedaPuntos((prevPuntos) => prevPuntos - 1);
                    } else {
                        setBovedaPuntos((prevPuntos) => prevPuntos + carta.coste);
                    }
                    addCartaQueryParams(carta, 'boveda');
                }
            }
        } else {
            const cartaAmount = mazo.reino.filter((c) => c.id === carta.id).length;

            if (cartaAmount < 4) {
                setMazo((prevMazo) => ({
                    ...prevMazo,
                    reino: [...prevMazo.reino, carta],
                }));
                addCartaQueryParams(carta, 'reino');
            }
        }
    }

    const handleCartaPlusClick = (carta: Carta) => {
        if (carta.tipo !== 'TESORO') {
            const cartaReinoAmount = mazo.reino.filter((c) => c.id === carta.id).length;
            const cartaSidedeckAmount = mazo.sideboard.filter((c) => c.id === carta.id).length;
            const cartaAmount = cartaReinoAmount + cartaSidedeckAmount;
            if (cartaAmount < 4) {
                setMazo((prevMazo) => ({
                    ...prevMazo,
                    reino: [...prevMazo.reino, carta],
                }));
                addCartaQueryParams(carta, 'reino');
            }
        } else {
            if (mazo.boveda.length < 15) {
                if (carta.nombre === 'TESORO GENERICO') {
                    setMazo((prevMazo) => ({
                        ...prevMazo,
                        boveda: [...prevMazo.boveda, carta],
                    }));
                    setBovedaPuntos((prevPuntos) => prevPuntos - 1);
                    addCartaQueryParams(carta, 'boveda');
                }
            }
        }

    }

    const handleCartaMinusClick = (carta: Carta) => {
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

            removeCartaQueryParams(carta, 'reino');
        } else {
            setMazo((prevMazo) => {
                const index = prevMazo.boveda.findIndex((c) => c.id === carta.id);
                if (index === -1) return prevMazo;

                return {
                    ...prevMazo,
                    boveda: [
                        ...prevMazo.boveda.slice(0, index),
                        ...prevMazo.boveda.slice(index + 1),
                    ],
                };
            });
            if (carta.nombre === 'TESORO GENERICO') {
                setBovedaPuntos((prevPuntos) => prevPuntos + 1);
            } else {
                setBovedaPuntos((prevPuntos) => prevPuntos - carta.coste);
            }
            removeCartaQueryParams(carta, 'boveda');
        }
    }

    const handleCartaSideboardClick = (carta: Carta, fromSection: string) => {
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

            switchCartaQueryParams(carta, 'reino', 'sideboard');
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

            switchCartaQueryParams(carta, 'sideboard', 'reino');
        }
    }

    const handleImportClick = async () => {
        const text = await navigator.clipboard.readText();
        const mazo = procesarListaMazo(text, cartas);
        const bovedaPuntos = mazo.boveda.reduce((acc, carta) => acc + carta.coste, 0);
        setBovedaPuntos(bovedaPuntos);
        addBulkCartaQueryParams(mazo);
        setMazo(mazo);
    }

    const handleExportClick = () => {
        const errors = validateMazo(mazo, searchParams.get('subtipo1') || '', searchParams.get('subtipo2') || '');
        setErrors(errors);
        if (errors.length === 0) {
            console.log("exporto");
            const mazoString = exportarListaMazo(mazo);
            navigator.clipboard.writeText(mazoString);
        }
    }

    const getFormattedDate = () => {
        const now = new Date();

        const pad = (num: number) => num.toString().padStart(2, '0');

        const day = pad(now.getDate());
        const month = pad(now.getMonth() + 1);
        const year = now.getFullYear().toString().slice(-2);
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        return `${day}${month}${year}${hours}${minutes}${seconds}`;
    };

    const handleDownloadClick = () => {
        const errors = validateMazo(mazo, searchParams.get('subtipo1') || '', searchParams.get('subtipo2') || '');
        setErrors(errors);
        if (errors.length === 0) {
            const mazoString = exportarListaMazo(mazo);
            const blob = new Blob([mazoString], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const subtipo1 = searchParams.get('subtipo1')?.toLowerCase() || '';
            const subtipo2 = searchParams.get('subtipo2')?.toLowerCase() || '';

            const link = document.createElement('a');

            if (subtipo1 && subtipo2) {
                link.download = `mazo-${subtipo1}-${subtipo2}-${getFormattedDate()}.txt`;
            } else if (subtipo1) {
                link.download = `mazo-${subtipo1}-${getFormattedDate()}.txt`;
            } else if (subtipo2) {
                link.download = `mazo-${subtipo2}-${getFormattedDate()}.txt`;
            } else {
                link.download = `mazo-${getFormattedDate()}.txt`;
            }

            link.href = url;
            link.click();

            URL.revokeObjectURL(url);
        }
    }

    const switchCartaQueryParams = (carta: Carta, fromSection: string, toSection: string) => {
        const currentParams = searchParams?.toString() || '';
        const params = new URLSearchParams(currentParams);

        const fromSectionParams = searchParams.get(fromSection);
        const toSectionParams = searchParams.get(toSection);

        const toSectionArray = toSectionParams ? toSectionParams.split(';') : [];
        toSectionArray.push(carta.nombre);
        params.set(toSection, toSectionArray.join(';'));

        if (fromSectionParams) {
            const fromSectionArray = fromSectionParams.split(';');
            const index = fromSectionArray.findIndex((c) => c === carta.nombre);
            if (index !== -1) {
                fromSectionArray.splice(index, 1);
                params.set(fromSection, fromSectionArray.join(';'));
                if (fromSectionArray.length === 0) {
                    params.delete(fromSection);
                }
            }
        }

        window.history.replaceState(null, '', `?${params.toString()}`);
    }

    const addCartaQueryParams = (carta: Carta, section: string) => {
        const currentParams = searchParams?.toString() || '';
        const params = new URLSearchParams(currentParams);
        const sectionParams = searchParams.get(section);

        const updatedReinoArray = sectionParams ? sectionParams.split(';') : [];
        updatedReinoArray.push(carta.nombre);

        params.set(section, updatedReinoArray.join(';'));
        window.history.replaceState(null, '', `?${params.toString()}`);
    };

    const addBulkCartaQueryParams = (mazo: Mazo) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.delete('reino');
        params.delete('sideboard');
        params.delete('boveda');

        if (mazo.reino.length > 0) {
            const reinoArray = mazo.reino.map((carta) => carta.nombre);
            params.set('reino', reinoArray.join(';'));
        }

        if (mazo.sideboard.length > 0) {
            const sideboardArray = mazo.sideboard.map((carta) => carta.nombre);
            params.set('sideboard', sideboardArray.join(';'));
        }

        if (mazo.boveda.length > 0) {
            const bovedaArray = mazo.boveda.map((carta) => carta.nombre);
            params.set('boveda', bovedaArray.join(';'));
        }

        window.history.replaceState(null, '', `?${params.toString()}`);
    }

    const removeCartaQueryParams = (carta: Carta, section: string) => {
        const sectionParams = searchParams.get(section);
        const params = new URLSearchParams(searchParams?.toString() || '');

        if (sectionParams) {
            const reinoArray = sectionParams.split(';');
            const index = reinoArray.findIndex((c) => c === carta.nombre);
            if (index !== -1) {
                reinoArray.splice(index, 1);
                params.set(section, reinoArray.join(';'));
                if (reinoArray.length === 0) {
                    params.delete(section);
                }
                window.history.replaceState(null, '', `?${params.toString()}`);
            }
        }
    }

    function exportarListaMazo(mazo: Mazo): string {
        const reinoReduced = Object.values(
            mazo.reino.reduce((acc: Record<number, CartaCantidad>, carta) => {
                if (acc[carta.id]) {
                    acc[carta.id].cantidad++;
                } else {
                    acc[carta.id] = { ...carta, cantidad: 1 };
                }
                return acc;
            }, {})
        );
        const sideboardReduced = Object.values(
            mazo.sideboard.reduce((acc: Record<number, CartaCantidad>, carta) => {
                if (acc[carta.id]) {
                    acc[carta.id].cantidad++;
                } else {
                    acc[carta.id] = { ...carta, cantidad: 1 };
                }
                return acc;
            }, {})
        );
        const bovedaReduced = Object.values(
            mazo.boveda.reduce((acc: Record<number, CartaCantidad>, carta) => {
                if (acc[carta.id]) {
                    acc[carta.id].cantidad++;
                } else {
                    acc[carta.id] = { ...carta, cantidad: 1 };
                }
                return acc;
            }, {})
        );

        const reino = reinoReduced.map((carta) => `${carta.nombre} x${carta.cantidad}`).join('\n');
        const boveda = bovedaReduced.map((carta) => `${carta.nombre} x${carta.cantidad}`).join('\n');
        const sideboard = sideboardReduced.map((carta) => `${carta.nombre} x${carta.cantidad}`).join('\n');

        return `Reino: (total: ${mazo.reino.length})\n${reino}\n\nBóveda: (total: ${mazo.boveda.length})\n${boveda}\n\nSide Deck (total: ${mazo.sideboard.length})\n${sideboard}`;
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
                return Array(cantidad).fill(carta);
            }
        }
        return undefined;
    }

    const validateMazo = (mazo: Mazo, subtipo1: string, subtipo2: string): string[] => {
        const REINO_MAX = 60;
        const REINO_MIN = 45;
        const SIDEDECK_MAX = 7;
        const BOVEDA_MAX = 15;
        //const REINO_CARD_LIMIT = 4;
        //const BOVEDA_CARD_LIMIT = 1;
        const BOVEDA_PUNTOS_MAX = 30;

        const errors: string[] = [];

        if (mazo.reino.length < REINO_MIN) {
            errors.push(`El mazo debe tener al menos ${REINO_MIN} cartas en el reino.`);
        }

        if (mazo.reino.length > REINO_MAX) {
            errors.push(`El mazo no puede tener más de ${REINO_MAX} cartas en el reino.`);
        }

        if (mazo.sideboard.length < SIDEDECK_MAX) {
            errors.push(`El mazo debe tener al menos ${SIDEDECK_MAX} cartas en el sidedeck.`);
        }

        if (mazo.sideboard.length > SIDEDECK_MAX) {
            errors.push(`El mazo no puede tener más de ${SIDEDECK_MAX} cartas en el sidedeck.`);
        }

        if (mazo.boveda.length < BOVEDA_MAX) {
            errors.push(`El mazo debe tener al menos ${BOVEDA_MAX} cartas en la bóveda.`);
        }

        if (mazo.boveda.length > BOVEDA_MAX) {
            errors.push(`El mazo no puede tener más de ${BOVEDA_MAX} cartas en la bóveda.`);
        }

        if (!subtipo1 || !subtipo2) {
            errors.push('Los subtipos son requeridos.');
        }

        if (bovedaPuntos > BOVEDA_PUNTOS_MAX) {
            errors.push(`La bóveda no puede tener más de ${BOVEDA_PUNTOS_MAX} puntos.`);
        }

        return errors;
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
                            onImportClick={handleImportClick}
                            onExportClick={handleExportClick}
                            onDownloadClick={handleDownloadClick}
                            validationErrors={errors}
                            bovedaPuntos={bovedaPuntos} />
                    </div>
                    <div className="md:col-span-3 lg:col-span-2">
                        <CartaSearch cartas={cartas} onCartaClick={handleCartaClick} />
                    </div>
                </div>
            </div>
        </Suspense>
    );
}