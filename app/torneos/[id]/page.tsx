import LoadingSpinner from "@/app/components/LoadingSpinner";
import ParticipanteList from "@/app/components/ParticipanteList";
import SearchBar from "@/app/components/SearchBar";
import { prisma } from "@/app/db/prisma";
import { Suspense } from "react";

export default async function Torneo({ params }: { params: { id: string } }) {
    const torneo = await prisma.torneo.findUnique({
        where: { id: parseInt(params.id) },
        include: {
            mazos: {
                include: {
                    mazo: true,
                },
            },
        },
    });

    if (!torneo) {
        return <div>No se encontró el torneo</div>;
    }
    console.log(torneo);
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <div className="p-4">
                <div className="pb-4">
                    <SearchBar />
                </div>
                <div className="">
                    <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                            {torneo.nombre}
                        </span>
                    </h1>
                    <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-2xl"><span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Participantes</span>
                    </h1>
                    <ParticipanteList mazos={torneo.mazos} />
                </div>
            </div >
        </Suspense >
    );
}

export async function generateStaticParams() {
    const torneo = await prisma.torneo.findMany();

    return torneo.map((torneo) => ({
        id: torneo.id.toString(),
    }))
}