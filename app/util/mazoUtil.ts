import { Carta, Mazo } from "@prisma/client";
import { MazoTemporal } from "../components/mazo/MazoBuilder";
import { prisma } from "../db/prisma";
import { CartaCantidad } from "../components/mazo/MazoSection";

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

export const validateMazo = (mazo: MazoTemporal, subtipo1: string, subtipo2: string): string[] => {
    const REINO_MAX = 60;
    const REINO_MIN = 45;
    const SIDEDECK_MAX = 7;
    const BOVEDA_MAX = 15;
    const REINO_SIDEDECK_CARD_LIMIT = 4;
    const BOVEDA_PUNTOS_MAX = 30;

    const errors: string[] = [];

    if (mazo.reino.length < REINO_MIN) {
        errors.push(`El mazo debe tener al menos ${REINO_MIN} cartas en el reino.`);
    }

    if (mazo.reino.length > REINO_MAX) {
        errors.push(`El mazo no puede tener más de ${REINO_MAX} cartas en el reino.`);
    }

    if (mazo.sideboard.length < SIDEDECK_MAX) {
        errors.push(`El mazo debe tener al menos ${SIDEDECK_MAX} cartas en el sidedeck.`);
    }

    if (mazo.sideboard.length > SIDEDECK_MAX) {
        errors.push(`El mazo no puede tener más de ${SIDEDECK_MAX} cartas en el sidedeck.`);
    }

    if (mazo.boveda.length < BOVEDA_MAX) {
        errors.push(`El mazo debe tener al menos ${BOVEDA_MAX} cartas en la bóveda.`);
    }

    if (mazo.boveda.length > BOVEDA_MAX) {
        errors.push(`El mazo no puede tener más de ${BOVEDA_MAX} cartas en la bóveda.`);
    }

    if (!subtipo1 || !subtipo2) {
        errors.push('Los subtipos son requeridos.');
    }

    const reinoSidedeck = mazo.reino.concat(mazo.sideboard);
    const reinoSidedeckMap = reinoSidedeck.reduce((acc, carta) => {
        if (acc[carta.id]) {
            acc[carta.id]++;
        } else {
            acc[carta.id] = 1;
        }
        return acc;
    }, {} as Record<number, number>);

    const reinoSidedeckInvalid = Object.values(reinoSidedeckMap).filter((cantidad) => cantidad > REINO_SIDEDECK_CARD_LIMIT);

    if (reinoSidedeckInvalid.length > 0) {
        errors.push(`El mazo no puede tener más de ${REINO_SIDEDECK_CARD_LIMIT} copias de una misma carta entre el reino y sidedeck.`);
    }

    reinoSidedeck.forEach((carta) => {
        const cartaSubtipos = [carta.subtipo1, carta.subtipo2, carta.subtipo3, carta.subtipo4];
        const subtiposMatch = cartaSubtipos.filter((subtipo) => subtipo === subtipo1 || subtipo === subtipo2 || subtipo === 'MIMETICO');
        if (subtiposMatch.length === 0) {
            if (carta.tipo === 'UNIDAD') {
                errors.push(`La carta ${carta.nombre} no tiene los subtipos requeridos.`);
            } else {
                const cartaSubtiposConcat = cartaSubtipos.filter((subtipo) => subtipo !== null).join("");
                if (carta.tipo === 'ACCION') {
                    if (cartaSubtiposConcat !== 'COMUN' && cartaSubtiposConcat !== 'RAPIDA') {
                        errors.push(`La carta ${carta.nombre} no tiene los subtipos requeridos.`);
                    }
                } else {
                    if (cartaSubtiposConcat !== '') {
                        errors.push(`La carta ${carta.nombre} no tiene los subtipos requeridos.`);
                    }
                }
            }
        }
    });

    mazo.reino.concat(mazo.sideboard).concat(mazo.boveda).forEach((carta) => {
        if (carta.prohibida) {
            errors.push(`La carta ${carta.nombre} está prohibida.`);
        }
    });

    const bovedaPuntos = calcularPuntosBoveda(mazo.boveda);
    if (bovedaPuntos > BOVEDA_PUNTOS_MAX) {
        errors.push(`La bóveda no puede tener más de ${BOVEDA_PUNTOS_MAX} puntos.`);
    }

    return errors;
}

export function exportarListaMazo(mazo: MazoTemporal): string {
    const reinoReduced = Object.values(
        mazo.reino.reduce((acc: Record<number, CartaCantidad>, carta) => {
            if (acc[carta.id]) {
                acc[carta.id].cantidad++;
            } else {
                acc[carta.id] = { ...carta, cantidad: 1 };
            }
            return acc;
        }, {})
    );
    const sideboardReduced = Object.values(
        mazo.sideboard.reduce((acc: Record<number, CartaCantidad>, carta) => {
            if (acc[carta.id]) {
                acc[carta.id].cantidad++;
            } else {
                acc[carta.id] = { ...carta, cantidad: 1 };
            }
            return acc;
        }, {})
    );
    const bovedaReduced = Object.values(
        mazo.boveda.reduce((acc: Record<number, CartaCantidad>, carta) => {
            if (acc[carta.id]) {
                acc[carta.id].cantidad++;
            } else {
                acc[carta.id] = { ...carta, cantidad: 1 };
            }
            return acc;
        }, {})
    );

    const reino = reinoReduced.map((carta) => `${carta.nombre} x${carta.cantidad}`).join('\n');
    const boveda = bovedaReduced.map((carta) => `${carta.nombre} x${carta.cantidad}`).join('\n');
    const sideboard = sideboardReduced.map((carta) => `${carta.nombre} x${carta.cantidad}`).join('\n');

    return `Reino: (total: ${mazo.reino.length})\n${reino}\n\nBóveda: (total: ${mazo.boveda.length})\n${boveda}\n\nSide Deck: (total: ${mazo.sideboard.length})\n${sideboard}`;
}

export const getFormattedDate = () => {
    const now = new Date();

    const pad = (num: number) => num.toString().padStart(2, '0');

    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear().toString().slice(-2);
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${day}${month}${year}${hours}${minutes}${seconds}`;
};