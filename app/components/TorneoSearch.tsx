"use client";

import { } from "react";
import { useSearchParams } from "next/navigation";
import { Torneo } from "@prisma/client";
import TorneoList from "./TorneoList";

export default function TorneoSearch({ torneos}: { torneos: Torneo[] }) {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') ?? '';

    const filteredTorneos = torneos.filter((torneo) => torneo.nombre.toLowerCase().includes(query?.toLowerCase()));

    return (
        <TorneoList torneos={filteredTorneos} />
    );
}
