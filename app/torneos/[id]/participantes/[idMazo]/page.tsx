import { MazoTemporal } from "@/app/components/mazo/MazoBuilder";
import MazoGridView from "@/app/components/mazo/MazoGridView";
import MazoListView from "@/app/components/mazo/MazoListView";
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

    const mazo: MazoTemporal = {
        reino: reinoCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        sideboard: sideboardCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        boveda: bovedaCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
    }
    const bovedaPuntosNoGenericos = mazo.boveda.reduce((acc, carta) => acc + carta.coste, 0);
    const tesorosGenericos = mazo.boveda.filter((c) => c.nombre === 'TESORO GENERICO').length;
    const bovedaPuntos = bovedaPuntosNoGenericos - tesorosGenericos;
    return (
        <div className="p-4">
            <div className="hidden lg:block">
                <MazoGridView mazo={mazo} subtipo1={torneoMazo.mazo.subtipo1} subtipo2={torneoMazo.mazo.subtipo2} nombre={torneoMazo.participante} bovedaPuntos={bovedaPuntos} />
            </div>
            <div className="block lg:hidden">
                <MazoListView mazo={mazo} subtipo1={torneoMazo.mazo.subtipo1} subtipo2={torneoMazo.mazo.subtipo2} nombre={torneoMazo.participante} bovedaPuntos={bovedaPuntos}/>
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