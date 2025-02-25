import { MazoTemporal } from "@/app/components/mazo/MazoBuilder";
import MazoError from "@/app/components/mazo/MazoError";
import MazoViewer from "@/app/components/mazo/MazoViewer";
import TorneoError from "@/app/components/torneo/TorneoError";
import { prisma } from "@/app/db/prisma";
import { Carta } from "@prisma/client";

export default async function TorneoMazo({ params }: { params: Promise<{ id: string, idMazo: string }> }) {
    const torneoMazo = await prisma.torneoMazo.findUnique({ where: { id: parseInt((await params).idMazo) }, include: { mazo: true } });
    if (!torneoMazo) {
        return <MazoError />;
    }
    const torneo = await prisma.torneo.findUnique({ where: { id: parseInt((await params).id) } });
    if (!torneo) {
        return <TorneoError />;
    }
    const reinoCartas = await prisma.mazoCarta.findMany({
        where: {
            mazoId: torneoMazo.mazoId,
            seccion: 'reino',
        },
        include: {
            carta: true,
        },
        orderBy: {
            carta: {
                coste: 'asc',
            },
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
        orderBy: {
            carta: {
                coste: 'asc',
            },
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
        orderBy: {
            carta: {
                coste: 'asc',
            },
        },
    });
    const cartas: Carta[] = [];
    reinoCartas.forEach((reinoCarta) => {
        for (let i = 0; i < reinoCarta.cantidad; i++)
            cartas.push(reinoCarta.carta);
    });
    const mazo: MazoTemporal = {
        reino: reinoCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        sideboard: sideboardCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        boveda: bovedaCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
    }
    return (
        <div className="">
            <MazoViewer mazoGuardado={mazo} subtipo1Guardado={torneoMazo.mazo.subtipo1} subtipo2Guardado={torneoMazo.mazo.subtipo2} nombreGuardado={torneoMazo.participante} videosGuardado={torneoMazo.videos} />
        </div>
    );
}

/*
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
*/