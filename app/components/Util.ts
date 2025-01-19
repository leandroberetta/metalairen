import { ReadonlyURLSearchParams } from "next/navigation";
import { Mazo } from "./MazoBuilder";

export const addBulkCartaQueryParams = (mazo: Mazo, searchParams: ReadonlyURLSearchParams) => {
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