"use client";

import { } from "react";
import { useSearchParams } from "next/navigation";
import CartaList from "./CartaList";
import { Carta } from "@prisma/client";

export default function CartaSearch({ cartas, onCartaClick }: { cartas: Carta[], onCartaClick?: (carta: Carta) => void }) {
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

    const filteredCartas =
        (!query && expansiones === '' && tipos === '' && subtipos === '' && subtipos2 === '' && supertipos === '' && costes === '' && rarezas === '' && formatos === '')
            ? []
            : cartas
                .filter((card) => query ? card.nombre.toLowerCase().includes(query.toLowerCase()) : true)
                .filter((card) => expansiones === '' || expansiones.split(',').includes(card.expansion.toString()))
                .filter((card) => {
                    if (tipos !== '') {
                        const esAccionRapida = tipos === 'ACCION RAPIDA' && (card.subtipo3 === 'RAPIDA');
                        const esOtraOrden = !tipos.split(',').includes('ACCION RAPIDA') && tipos.split(',').includes(card.tipo.toString());
                        return (esOtraOrden && card.subtipo3 != 'RAPIDA') || esAccionRapida;
                    } else {
                        return true;
                    }
                })
                .filter((card) => subtipos === '' || ((card.subtipo1 && subtipos.split(',').includes(card.subtipo1.toString())) || (card.subtipo2 && subtipos.split(',').includes(card.subtipo2.toString()))))
                .filter((card) => subtipos2 === '' || ((card.subtipo1 && subtipos2.split(',').includes(card.subtipo1.toString())) || (card.subtipo2 && subtipos2.split(',').includes(card.subtipo2.toString()))))
                .filter((card) => supertipos === '' || (card.supertipo && supertipos.split(',').includes(card.supertipo.toString())))
                .filter((card) => costes === '' || costes.split(',').includes(card.coste.toString()))
                .filter((card) => rarezas === '' || rarezas.split(',').includes(card.rareza.toString()))
                .filter((card) => {
                    return formatos === '' || formatos.split(',').includes('ETHERNAL') || (formatos.split(',').includes('DOMINACION') && (card.prohibida == false && card.expansion !== 'FUNDAMENTOS'));
                })
                .sort((a, b) => a.nombre.localeCompare(b.nombre));

    return (
        <CartaList cartas={filteredCartas} onCartaClick={onCartaClick} />
    );
}
