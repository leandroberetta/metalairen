"use client";

import { } from "react";
import { useSearchParams } from "next/navigation";
import MazoList from "./MazoList";
import { Mazo } from "@prisma/client";

export default function MazoSearch({ mazos, linkEdit }: { mazos: Mazo[], linkEdit?: boolean }) {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') ?? '';
    const subtipo1 = searchParams.get('subtipo1') ?? '';
    const subtipo2 = searchParams.get('subtipo2') ?? '';

    const filteredMazos = mazos.filter((mazo) => {
        const matchesNombre = mazo.nombre.toLowerCase().includes(query.toLowerCase());
        const matchesSubtipo1 = subtipo1
            ? mazo.subtipo1?.includes(subtipo1) || mazo.subtipo2?.includes(subtipo1)
            : true;
        const matchesSubtipo2 = subtipo2
            ? mazo.subtipo1?.includes(subtipo2) || mazo.subtipo2?.includes(subtipo2)
            : true;
        return matchesNombre && matchesSubtipo1 && matchesSubtipo2;
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
