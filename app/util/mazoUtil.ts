import { Carta, Mazo } from "@prisma/client";
import { MazoTemporal } from "../components/mazo/MazoBuilder";
import { prisma } from "../db/prisma";

export function crearMazoQueryParams(searchParams: URLSearchParams, cartas: Carta[]): MazoTemporal {
    const reinoQueryParamCartas = searchParams.get('reino')?.split(';');
    const reinoCartas = reinoQueryParamCartas?.map((id) => cartas.find((c) => c.id === parseInt(id))) as Carta[];

    const sideboardQueryParamCartas = searchParams.get('sideboard')?.split(';');
    const sideboardCartas = sideboardQueryParamCartas?.map((id) => cartas.find((c) => c.id === parseInt(id))) as Carta[];

    const bovedaQueryParamCartas = searchParams.get('boveda')?.split(';');
    const bovedaCartas = bovedaQueryParamCartas?.map((id) => cartas.find((c) => c.id === parseInt(id))) as Carta[];

    return {
        reino: reinoCartas || [],
        sideboard: sideboardCartas || [],
        boveda: bovedaCartas || []
    };
}

export function calcularPuntosBoveda(boveda: Carta[]) {
    const bovedaPuntos = boveda.reduce((acc, carta) => acc + carta.coste, 0);
    const tesorosGenericos = boveda.filter((c) => c.nombre === 'TESORO GENERICO').length;

    return bovedaPuntos - tesorosGenericos;
}

export const addSubtiposQueryParams = (searchParams: URLSearchParams, subtipo1: string | null | undefined, subtipo2: string | null | undefined) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete("subtipo1");
    params.delete("subtipo2");
    if (subtipo1) {
        params.set("subtipo1", subtipo1);
    }
    if (subtipo2) {
        params.set("subtipo2", subtipo2);
    }
    window.history.replaceState(null, '', `?${params.toString()}`);

}

export const addBulkCartaQueryParams = (searchParams: URLSearchParams, mazo: MazoTemporal) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete('reino');
    params.delete('sideboard');
    params.delete('boveda');

    if (mazo.reino.length > 0) {
        const reinoArray = mazo.reino.map((carta) => carta.id.toString());
        params.set('reino', reinoArray.join(';'));
    }

    if (mazo.sideboard.length > 0) {
        const sideboardArray = mazo.sideboard.map((carta) => carta.id.toString());
        params.set('sideboard', sideboardArray.join(';'));
    }

    if (mazo.boveda.length > 0) {
        const bovedaArray = mazo.boveda.map((carta) => carta.id.toString());
        params.set('boveda', bovedaArray.join(';'));
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
}

export const agregarMazoQueryParams = (searchParams: URLSearchParams, mazo: MazoTemporal, subtipo1: string | null | undefined, subtipo2: string | null | undefined) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete('reino');
    params.delete('sideboard');
    params.delete('boveda');

    if (mazo.reino.length > 0) {
        const reinoArray = mazo.reino.map((carta) => carta.id.toString());
        params.set('reino', reinoArray.join(';'));
    }

    if (mazo.sideboard.length > 0) {
        const sideboardArray = mazo.sideboard.map((carta) => carta.id.toString());
        params.set('sideboard', sideboardArray.join(';'));
    }

    if (mazo.boveda.length > 0) {
        const bovedaArray = mazo.boveda.map((carta) => carta.id.toString());
        params.set('boveda', bovedaArray.join(';'));
    }

    params.delete("subtipo1");
    params.delete("subtipo2");
    if (subtipo1) {
        params.set("subtipo1", subtipo1);
    }
    if (subtipo2) {
        params.set("subtipo2", subtipo2);
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
}

export async function buildMazo(mazo: Mazo): Promise<MazoTemporal> {
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

    const mazoTmp: MazoTemporal = {
        reino: reinoCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        sideboard: sideboardCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
        boveda: bovedaCartas.flatMap(({ carta, cantidad }) => Array(cantidad).fill(carta)),
    }

    return mazoTmp;
}