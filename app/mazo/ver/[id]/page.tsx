import { Mazo } from "@/app/components/MazoBuilder";
import MazoGridView from "@/app/components/MazoGridView";
import MazoListView from "@/app/components/MazoListView";
import { prisma } from "@/app/db/prisma";
import { Carta } from "@prisma/client";

export default async function MazoId({ params }: { params: Promise<{ id: string, idMazo: string }> }) {
    const mazo = await prisma.mazo.findUnique({
        where: { id: parseInt((await params).id) },
        include: {
            cartas: true,
        },
    },
    );

    if (!mazo) {
        return <div>No se encontró el torneo</div>;
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

    const mazoDict: Mazo = {
        reino: reinoCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        sideboard: sideboardCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        boveda: bovedaCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
    }
    const bovedaPuntosNoGenericos = mazoDict.boveda.reduce((acc, carta) => acc + carta.coste, 0);
    const tesorosGenericos = mazoDict.boveda.filter((c) => c.nombre === 'TESORO GENERICO').length;
    const bovedaPuntos = bovedaPuntosNoGenericos - tesorosGenericos;

    return (
        <div className="p-4">
            <div className="hidden lg:block">
                <MazoGridView mazo={mazoDict} subtipo1={mazo.subtipo1} subtipo2={mazo.subtipo2} nombre={mazo.nombre} bovedaPuntos={bovedaPuntos} />
            </div>
            <div className="block lg:hidden">
                <MazoListView mazo={mazoDict} subtipo1={mazo.subtipo1} subtipo2={mazo.subtipo2} nombre={mazo.nombre} bovedaPuntos={bovedaPuntos} />
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    const mazos = await prisma.mazo.findMany();

    return mazos.map((mazo) => ({
        id: mazo.id.toString(),
    }))
}