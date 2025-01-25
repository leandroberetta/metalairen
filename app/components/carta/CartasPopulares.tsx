import { prisma } from "../../db/prisma";

export default async function CartasPopulares({ section, title }: { section: string, title: string }) {
    const cartasMasUsadas = await prisma.mazoCarta.groupBy({
        by: ['cartaId'],
        _sum: {
            cantidad: true,
        },
        where: {
            seccion: section,
        },
        orderBy: {
            _sum: {
                cantidad: 'desc',
            },
        },
        take: 5,
    });

    const cartasDetalles = await prisma.carta.findMany({
        where: {
            id: {
                in: cartasMasUsadas.map((item) => item.cartaId),
            },
        },
    });

    return (
        <>
            {cartasDetalles.length > 0 && (
                <div className="p-4 pt-0">
                    <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                            {title}
                        </span>
                    </h1>
                    <div className="grid grid-cols-2 justify-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 py-4">
                        {cartasDetalles.map((carta) => (
                            <div key={carta.id} className="relative inline-block transition ease-in-out hover:scale-110 cursor-pointer">
                                <img
                                    src={carta.imagen}
                                    alt={`Card ${carta.id}`}
                                    className="rounded-xl shadow dark:shadow dark:shadow-gray-800"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}