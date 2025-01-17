"use client";

import { Carta } from "@prisma/client";
import { Mazo } from "./MazoBuilder";
import MazoGridView from "./MazoGridView";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MazoListView from "./MazoListView";

export default function MazoViewer({ cartas }: { cartas: Carta[] }) {
    const [mazo, setMazo] = useState<Mazo>({ reino: [], boveda: [], sideboard: [] });
    const [bovedaPuntos, setBovedaPuntos] = useState(0);
    const [subtipo1, setSubtipo1] = useState<string | null>(null);
    const [subtipo2, setSubtipo2] = useState<string | null>(null);
    const [nombre, setNombre] = useState<string | null>("Mazo");
    const searchParams = useSearchParams();

    useEffect(() => {
        const reinoQueryParamCartas = searchParams.get('reino')?.split(';');
        const reinoCartas = reinoQueryParamCartas?.map((id) => cartas.find((c) => c.id === parseInt(id))) as Carta[];

        const sideboardQueryParamCartas = searchParams.get('sideboard')?.split(';');
        const sideboardCartas = sideboardQueryParamCartas?.map((id) => cartas.find((c) => c.id === parseInt(id))) as Carta[];

        const bovedaQueryParamCartas = searchParams.get('boveda')?.split(';');
        const bovedaCartas = bovedaQueryParamCartas?.map((id) => cartas.find((c) => c.id === parseInt(id))) as Carta[];

        setSubtipo1(searchParams.get('subtipo1'));
        setSubtipo2(searchParams.get('subtipo2'));
        const nombre = searchParams.get('nombre');
        if (nombre) {
            setNombre(searchParams.get('nombre'));
        }

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

    }, [searchParams, cartas]);


    return (
        <div className="p-4">
            <div className="hidden lg:block">
                <MazoGridView mazo={mazo} subtipo1={subtipo1} subtipo2={subtipo2} nombre={nombre} bovedaPuntos={bovedaPuntos} />
            </div>
            <div className="block lg:hidden">
                <MazoListView mazo={mazo} subtipo1={subtipo1} subtipo2={subtipo2} nombre={nombre} bovedaPuntos={bovedaPuntos} />
            </div>
        </div>
    );
}