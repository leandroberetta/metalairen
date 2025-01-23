import { Carta } from "@prisma/client";
import { MazoTemporal } from "../components/mazo/MazoBuilder";

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