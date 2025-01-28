import { Carta } from "@prisma/client";

export default function MazoCartaItem({ carta, cantidad }: { carta: Carta; cantidad: number }) {
    return (
        <div key={carta.id} className="">
            <img className="rounded-lg" src={carta.imagen} alt={`Card ${carta.id}`} />
            <div className="absolute inset-0 flex items-start justify-center">
                <span className="mt-11 text-white text-md font-bold bg-black bg-opacity-50 rounded px-2 py-1">
                    x{cantidad}
                </span>

            </div>
        </div>
    );
}