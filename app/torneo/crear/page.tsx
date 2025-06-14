import { handleCrearTorneo } from "@/app/backend";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import CrearTorneo from "@/app/components/torneo/CrearTorneo";
import { Suspense } from "react";

export default async function CrearTorneoPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <CrearTorneo onCrearTorneo={handleCrearTorneo}/>
        </Suspense>
    );
}
