import { MazoTemporal } from "@/app/components/mazo/MazoBuilder";
import MazoViewer from "@/app/components/mazo/MazoViewer";
import { prisma } from "@/app/db/prisma";
import { Carta } from "@prisma/client";

export default async function MazoId({ params }: { params: Promise<{ id: string }> }) {
    const mazo = await prisma.mazo.findUnique({
        where: { id: parseInt((await params).id) },
        include: {
            cartas: true,
        },
    },
    );

    if (!mazo) {
        return <div>No se encontró el mazo.</div>;
    }

    const reinoCartas = await prisma.mazoCarta.findMany({
        where: {
            mazoId: mazo.id,
            seccion: 'reino',
        },
        include: {
            carta: true,
        },
    });
    const sideboardCartas = await prisma.mazoCarta.findMany({
        where: {
            mazoId: mazo.id,
            seccion: 'sidedeck',
        },
        include: {
            carta: true,
        },
    });
    const bovedaCartas = await prisma.mazoCarta.findMany({
        where: {
            mazoId: mazo.id,
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

    const mazoTmp: MazoTemporal = {
        reino: reinoCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        sideboard: sideboardCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        boveda: bovedaCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
    }

    return (
        <MazoViewer mazoGuardado={mazoTmp} nombreGuardado={mazo.nombre} subtipo1Guardado={mazo.subtipo1} subtipo2Guardado={mazo.subtipo2}/>
    );
}

export async function generateStaticParams() {
    const mazos = await prisma.mazo.findMany();

    return mazos.map((mazo) => ({
        id: mazo.id.toString(),
    }))
}