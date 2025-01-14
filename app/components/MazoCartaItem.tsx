import { Carta } from "@prisma/client";

export default function MazoCartaItem({ carta, cantidad }: { carta: Carta; cantidad: number }) {
    return (
        <div key={carta.id} className="relative">
            <img className="rounded-lg" src={carta.imagen} alt={`Card ${carta.id}`} />
            <div className="absolute inset-0 flex items-start justify-center">
                <span className="mt-9 text-white text-md font-bold bg-black bg-opacity-70 rounded px-4 py-2">
                    x{cantidad}
                </span>

            </div>
        </div>
    );
}