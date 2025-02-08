"use client";

import { } from "react";
import { useSearchParams } from "next/navigation";
import MazoList from "./MazoList";
import { MazoConUsuario } from "./MazosCompartidos";

export default function MazoSearch({ mazos, linkEdit }: { mazos: MazoConUsuario[], linkEdit?: boolean }) {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') ?? '';
    const subtipo1 = searchParams.get('subtipo1') ?? '';
    const subtipo2 = searchParams.get('subtipo2') ?? '';
    const visibilidad = searchParams.get('visibilidad')?.split(',') ?? [];

    const filteredMazos = mazos.filter((mazo) => {
        const matchesNombre = mazo.nombre.toLowerCase().includes(query.toLowerCase());
        const matchesSubtipo1 = subtipo1
            ? mazo.subtipo1?.includes(subtipo1) || mazo.subtipo2?.includes(subtipo1)
            : true;
        const matchesSubtipo2 = subtipo2
            ? mazo.subtipo1?.includes(subtipo2) || mazo.subtipo2?.includes(subtipo2)
            : true;

        if (linkEdit) {
            if (visibilidad.length === 0 || visibilidad.length === 2) {
                return matchesNombre && matchesSubtipo1 && matchesSubtipo2;
            } else {
                if (visibilidad[0] === 'PUBLICO') {
                    return matchesNombre && matchesSubtipo1 && matchesSubtipo2 && mazo.publico;
                } else {
                    return matchesNombre && matchesSubtipo1 && matchesSubtipo2 && !mazo.publico;
                }
            }
        } else {
            return matchesNombre && matchesSubtipo1 && matchesSubtipo2;
        }
    });

    return (
        <>
            {filteredMazos.length > 0 ? (
                <MazoList mazos={filteredMazos} linkEdit={linkEdit} />
            ) : (
                <div className="text-gray-200">
                    No se encontraron mazos.
                </div>
            )}
        </>
    );
}
