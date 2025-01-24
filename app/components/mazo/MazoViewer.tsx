"use client";

import { Carta } from "@prisma/client";
import { MazoTemporal } from "./MazoBuilder";
import MazoGridView from "./MazoGridView";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MazoListView from "./MazoListView";
import { calcularPuntosBoveda, crearMazoQueryParams } from "@/app/util/mazoUtil";

export default function MazoViewer({ cartas, mazoGuardado, subtipo1Guardado, subtipo2Guardado, nombreGuardado }: {
    cartas?: Carta[],
    mazoGuardado?: MazoTemporal,
    subtipo1Guardado?: string | null,
    subtipo2Guardado?: string | null,
    nombreGuardado?: string | null
}) {
    const [mazo, setMazo] = useState<MazoTemporal>(mazoGuardado || { reino: [], boveda: [], sideboard: [] });
    const [bovedaPuntos, setBovedaPuntos] = useState(mazoGuardado ? calcularPuntosBoveda(mazoGuardado.boveda) : 0);
    const [subtipo1, setSubtipo1] = useState<string | null>(subtipo1Guardado || null);
    const [subtipo2, setSubtipo2] = useState<string | null>(subtipo2Guardado || null);
    const [nombre, setNombre] = useState<string | null>(nombreGuardado || "Mazo");
    const searchParams = useSearchParams();
    
    useEffect(() => {
        if (!cartas) {
            return;
        }

        const mazoQueryParams = crearMazoQueryParams(searchParams, cartas);

        setMazo(mazoQueryParams);
        setSubtipo1(searchParams.get('subtipo1'));
        setSubtipo2(searchParams.get('subtipo2'));

        const nombre = searchParams.get('nombre');
        if (nombre) {
            setNombre(searchParams.get('nombre'));
        }

        if (mazoQueryParams.boveda.length > 0) {
            setBovedaPuntos(calcularPuntosBoveda(mazoQueryParams.boveda));
        }
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