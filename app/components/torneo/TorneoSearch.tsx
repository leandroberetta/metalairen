"use client";

import { } from "react";
import { useSearchParams } from "next/navigation";
import { Torneo } from "@prisma/client";
import TorneoList from "./TorneoList";

export default function TorneoSearch({ torneos}: { torneos: Torneo[] }) {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') ?? '';
    const provincias = searchParams.get('provincias') ?? '';

    const filteredTorneos = torneos
        .filter((torneo) => torneo.nombre.toLowerCase().includes(query?.toLowerCase()))
        .filter((torneo) => provincias === '' || provincias.split(',').includes(torneo.provincia.toString()));

    return (
        <TorneoList torneos={filteredTorneos} />
    );
}
