import { handleEditarTorneo } from "@/app/backend";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import EditarTorneo from "@/app/components/torneo/EditarTorneo";
import TorneoError from "@/app/components/torneo/TorneoError";
import { prisma } from "@/app/db/prisma";
import { Suspense } from "react";

export default async function EditarTorneoPage({ params }: { params: Promise<{ id: string }> }) {
    const torneo = await prisma.torneo.findUnique({ where: { id: parseInt((await params).id) }, include: { mazos: true } });
    
    if (!torneo) {
        return <TorneoError />;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <EditarTorneo onEditarTorneo={handleEditarTorneo} idGuardado={torneo.id} nombreGuardado={torneo.nombre} sedeGuardado={torneo.sede} provinciaGuardado={torneo.provincia} fechaGuardado={torneo.fecha.toDateString()} oficialGuardado={torneo.oficial}/>
        </Suspense>
    );
}
