import LoadingSpinner from "@/app/components/LoadingSpinner";
import CombinacionesPopularesChart from "@/app/components/torneo/CombinacionesPopularesChart";
import SubtiposPopularesChart from "@/app/components/torneo/SubtiposPopularesChart";
import TorneoError from "@/app/components/torneo/TorneoError";
import { prisma } from "@/app/db/prisma";
import Link from "next/link";
import { Suspense } from "react";

export default async function Torneo({ params }: { params: Promise<{ id: string }> }) {
    const torneo = await prisma.torneo.findUnique({
        where: { id: parseInt((await params).id) },
        include: {
            mazos: {
                orderBy: [
                    { orden: 'asc' },
                    { id: 'asc' }
                ],
                include: {
                    mazo: true,
                },
            },
        },
    });

    if (!torneo) {
        return <TorneoError />;
    }

    const cartasMasUsadasReino = await prisma.mazoCarta.groupBy({
        by: ['cartaId'],
        _sum: {
            cantidad: true,
        },
        where: {
            seccion: "reino",
            mazo: {
                torneos: {
                    some: {
                        torneoId: { in: [torneo.id] },
                    },
                },
            },
        },
        orderBy: {
            _sum: {
                cantidad: 'desc',
            },
        },
        take: 6,
    });

    const cartasDetallesReino = await prisma.carta.findMany({
        where: {
            id: {
                in: cartasMasUsadasReino.map((item) => item.cartaId),
            },
        },
    });

    const cartasMasUsadasBoveda = await prisma.mazoCarta.groupBy({
        by: ['cartaId'],
        _sum: {
            cantidad: true,
        },
        where: {
            seccion: "boveda",
            mazo: {
                torneos: {
                    some: {
                        torneoId: { in: [torneo.id] },
                    },
                },
            },
        },
        orderBy: {
            _sum: {
                cantidad: 'desc',
            },
        },
        take: 6,
    });

    const cartasDetallesBoveda = await prisma.carta.findMany({
        where: {
            id: {
                in: cartasMasUsadasBoveda.map((item) => item.cartaId),
            },
        },
    });


    return (
        <Suspense fallback={<LoadingSpinner />}>
            <div className="p-4 pt-0">
                <div className="">
                    <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                            {torneo.nombre}
                        </span>
                    </h1>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h1 className="mb-4 text-xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-2xl"><span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Cartas populares del reino</span>
                                </h1>
                                <div className="grid grid-cols-2 justify-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ">
                                    {cartasDetallesReino.map((carta) => (
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
                            <div>
                                <h1 className="mb-4 text-xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-2xl"><span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Cartas populares de la bóveda</span>
                                </h1>
                                <div className="grid grid-cols-2 justify-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ">
                                    {cartasDetallesBoveda.map((carta) => (
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
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-2xl"><span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Combinaciones populares de subtipos</span>
                                </h1>
                                <div className="">
                                    <CombinacionesPopularesChart mazos={torneo.mazos.map((mazo) => mazo.mazo)} />
                                </div>
                            </div>
                            <div>
                                <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-2xl"><span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Subtipos populares</span>
                                </h1>
                                <div className="">
                                    <SubtiposPopularesChart mazos={torneo.mazos.map((mazo) => mazo.mazo)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-2xl"><span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Participantes</span>
                    </h1>
                    <div>
                        <div className="relative overflow-x-auto shadow dark:shadow dark:shadow-gray-800 rounded" >
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Participante
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Puesto
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Subtipo
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Subtipo
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {torneo.mazos.map((mazo) => (
                                        <tr key={mazo.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <h5 className="text-xl font-bold">
                                                    <Link href={`/torneos/${torneo.id}/participantes/${mazo.id}`} className="font-medium text-yellow-300 hover:text-yellow-400">
                                                        {mazo.participante}
                                                    </Link>
                                                </h5>
                                            </th>
                                            <td className="px-6 py-4">
                                                {mazo.puesto}
                                            </td>
                                            <td className="px-6 py-4">
                                                {mazo.mazo.subtipo1}
                                            </td>
                                            <td className="px-6 py-4">
                                                {mazo.mazo.subtipo2}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {torneo.informe && (
                    <>
                        <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-2xl mt-4"><span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Informe extendido (aporte de Tomás Fabbrini)</span>
                        </h1>
                        <div className=" ">
                            <iframe
                                src={torneo.informe}
                                style={{ width: '100%', height: '500px', border: 0 }}
                                title="Slides"
                            ></iframe>
                        </div>
                    </>
                )}
            </div >
        </Suspense >
    );
}

/*
export async function generateStaticParams() {
    const torneo = await prisma.torneo.findMany();

    return torneo.map((torneo) => ({
        id: torneo.id.toString(),
    }))
}
*/