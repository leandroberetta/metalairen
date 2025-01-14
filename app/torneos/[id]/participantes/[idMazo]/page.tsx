import MazoChart from "@/app/components/MazoChart";
import MazoSectionGrid from "@/app/components/MazoSectionGrid";
import { prisma } from "@/app/db/prisma";
import { Carta } from "@prisma/client";

export default async function TorneoMazo({ params }: { params: Promise<{ id: string, idMazo: string }> }) {
    const torneoMazo = await prisma.torneoMazo.findUnique({ where: { id: parseInt((await params).idMazo) }, include: { mazo: true } });
    if (!torneoMazo) {
        return <div>No se encontró el mazo</div>;
    }
    const torneo = await prisma.torneo.findUnique({ where: { id: parseInt((await params).id) } });
    if (!torneo) {
        return <div>No se encontró el torneo</div>;
    }
    const reinoCartas = await prisma.mazoCarta.findMany({
        where: {
            mazoId: torneoMazo.mazoId,
            seccion: 'reino',
        },
        include: {
            carta: true,
        },
    });
    const sideboardCartas = await prisma.mazoCarta.findMany({
        where: {
            mazoId: torneoMazo.mazoId,
            seccion: 'sidedeck',
        },
        include: {
            carta: true,
        },
    });
    const bovedaCartas = await prisma.mazoCarta.findMany({
        where: {
            mazoId: torneoMazo.mazoId,
            seccion: 'boveda',
        },
        include: {
            carta: true,
        },
    });
    const cartas: Carta[] = [];
    reinoCartas.forEach((reinoCarta) => {
        for (let i = 0; i < reinoCarta.cantidad; i++)
            cartas.push(reinoCarta.carta);
    });
    return (
        <div className="p-4">
            <div className="flex">
                <div className="grow">
                    <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                            {torneo.nombre} - {torneoMazo.participante} - {torneoMazo.puesto}
                        </span>
                    </h1>
                    <div className="">
                        <h2 className="text-xl dark:text-white font-extrabold text-gray-900">
                            {torneoMazo.mazo.subtipo1 && torneoMazo.mazo.subtipo2 && `${torneoMazo.mazo.subtipo1} / ${torneoMazo.mazo.subtipo2}`}
                        </h2>

                    </div>
                </div>
                <MazoChart mazo={{ reino: cartas, sideboard: [], boveda: [] }} />
            </div>
            <div>
                <div className="grid sm:grid-cols-4 lg:grid-cols-9 gap-4">
                    <div className="col-span-4">
                        <MazoSectionGrid cartas={reinoCartas} section="Reino" cols={4} />
                    </div>
                    <div className="col-span-4">
                        <MazoSectionGrid cartas={bovedaCartas} section="Bóveda" cols={4} />
                    </div>
                    <div className="">
                        <MazoSectionGrid cartas={sideboardCartas} section="Sidedeck" cols={1} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    const torneos = await prisma.torneo.findMany({
        include: {
            mazos: true,
        },
    });

    const paths: { id: string; idMazo: string; }[] = [];

    torneos.forEach((torneo) => {
        torneo.mazos.forEach((mazo) => {
            paths.push({
                id: torneo.id.toString(),
                idMazo: mazo.id.toString(),
            });
        });
    });

    return paths;
}