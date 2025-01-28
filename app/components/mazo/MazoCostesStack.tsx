import { Carta } from "@prisma/client";
import MazoCartaItem from "./MazoCartaItem";

export default function MazoCostesStack({ cartas }: { cartas: Carta[] }) {
    const cartasPorCostesReduced = cartas.reduce((acc: Record<number, Carta & { cantidad: number }>, carta) => {
        if (acc[carta.id]) {
            acc[carta.id].cantidad++;
        } else {
            acc[carta.id] = { ...carta, cantidad: 1 };
        }
        return acc;
    }, {});

    const cartasPorCostes = Object.values(cartasPorCostesReduced).reduce((acc: Record<number, (Carta & { cantidad: number })[]>, carta) => {
        if (acc[carta.coste]) {
            acc[carta.coste].push(carta);
        } else {
            acc[carta.coste] = [carta];
        }
        return acc;
    }, {});

    if (cartasPorCostes[8] || cartasPorCostes[9]) {
        if (cartasPorCostes[7]) {
            cartasPorCostes[7].push(...(cartasPorCostes[8] || []));
            cartasPorCostes[7].push(...(cartasPorCostes[9] || []));
        } else {
            cartasPorCostes[7] = [...(cartasPorCostes[8] || []), ...(cartasPorCostes[9] || [])];
        }
        delete cartasPorCostes[8];
        delete cartasPorCostes[9];
    }

    return (
        <div>
            <div className="grid grid-cols-7 gap-4 relative">
                {Array.from({ length: 7 }, (_, colIndex) => (
                    <div key={colIndex} className="relative rounded">
                        <div className="flex justify-center">
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-300 dark:text-gray-900 content-center">
                                {colIndex + 1 === 7 ? "7+" : colIndex + 1}
                            </span>
                        </div>
                        {cartasPorCostes[colIndex + 1]?.map((carta, i) => (
                            <button key={carta.id} type="button" className="">
                                <div style={{ top: `${i * 80 + 35}px` }} className="absolute">
                                    <MazoCartaItem key={carta.id} carta={carta} cantidad={carta.cantidad} />
                                </div>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
