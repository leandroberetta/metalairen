"use client";

import { } from "react";
import { useSearchParams } from "next/navigation";
import { Torneo } from "@prisma/client";
import TorneoList from "./TorneoList";

export default function TorneoSearch({ torneos, rol }: { torneos: Torneo[], rol: string }) {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') ?? '';
    const provincias = searchParams.get('provincias') ?? '';

    const filteredTorneos = torneos
        .filter((torneo) => torneo.nombre.toLowerCase().includes(query?.toLowerCase()))
        .filter((torneo) => provincias === '' || provincias.split(',').includes(torneo.provincia.toString()));

    return (
        <>
            {
                filteredTorneos.length > 0 ? (
                    < TorneoList torneos={filteredTorneos} rol={rol}/>
                ) : (
                    <div className="text-gray-200">
                        No se encontraron torneos.
                    </div>
                )
            }
        </>
    );
}
