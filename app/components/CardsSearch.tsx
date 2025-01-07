"use client";

import { } from "react";
import CardFilters from "./CardsFilters";
import CardsList from "./CardsList";
import SearchBar from "./SearchBar";
import { useSearchParams } from "next/navigation";
import { Card } from "../db/prisma";

export default function CardsSearch({ cards }: { cards: Card[] }) {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') ?? '';
    const expansiones = searchParams.get('expansiones') ?? '';
    const tipos = searchParams.get('tipos') ?? '';
    const subtipos = searchParams.get('subtipos') ?? '';
    const subtipos2 = searchParams.get('subtipos2') ?? '';
    const supertipos = searchParams.get('supertipos') ?? '';
    const costes = searchParams.get('costes') ?? '';
    const rarezas = searchParams.get('rarezas') ?? '';
    const formatos = searchParams.get('formatos') ?? '';

    const filteredCards = cards.filter((card) => card.nombre.toLowerCase().includes(query?.toLowerCase()))
        .filter((card) => expansiones === '' || expansiones.split(',').includes(card.expansion.toString()))
        .filter((card) => {
            const tipoIncluido = tipos === '' || tipos.split(',').includes(card.tipo.toString());
            const esAccionRapida = tipos.includes('ACCION RAPIDA') && card.subtipo3 === 'RAPIDA' && card.tipo === "ACCION";
            return (tipoIncluido && card.subtipo3 !== 'RAPIDA') || esAccionRapida;
        }).filter((card) => subtipos === '' || (subtipos.split(',').includes(card.subtipo1.toString()) || subtipos.split(',').includes(card.subtipo2.toString())))
        .filter((card) => subtipos2 === '' || (subtipos2.split(',').includes(card.subtipo1.toString()) || subtipos2.split(',').includes(card.subtipo2.toString())))
        .filter((card) => supertipos === '' || supertipos.split(',').includes(card.supertipo.toString()))
        .filter((card) => costes === '' || costes.split(',').includes(card.coste.toString()))
        .filter((card) => rarezas === '' || rarezas.split(',').includes(card.rareza.toString()))
        .filter((card) => {
            return formatos === '' || formatos === 'ETHERNAL' || (formatos === 'DOMINACION' && (card.prohibida == false && card.expansion !== 'FUNDAMENTOS'));
        })
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    return (
        <>
            <SearchBar filters={CardFilters()} />
            <CardsList cards={filteredCards} />
        </>
    );
}
