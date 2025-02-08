import LoadingSpinner from "@/app/components/LoadingSpinner";
import SearchBar from "@/app/components/SearchBar";
import CombinacionesPopularesChart from "@/app/components/torneo/CombinacionesPopularesChart";
import CombinacionesPopularesPieChart from "@/app/components/torneo/CombinacionesPopularesPieChart";
import TorneoError from "@/app/components/torneo/TorneoError";
import { prisma } from "@/app/db/prisma";
import Link from "next/link";
import { Suspense } from "react";

export default async function Torneo({ params }: { params: Promise<{ id: string }> }) {
    const torneo = await prisma.torneo.findUnique({
        where: { id: parseInt((await params).id) },
        include: {
            mazos: {
                orderBy: {
                    id: 'asc',
                },
                include: {
                    mazo: true,
                },
            },
        },
    });

    if (!torneo) {
        return <TorneoError />;
    }
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <div className="p-4 pt-0">
                <div className="pb-4">
                    <SearchBar />
                </div>
                <div className="">
                    <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                            {torneo.nombre}
                        </span>
                    </h1>

                    <div className="grid grid-cols-1 gap-4">

                        <div>
                            <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-2xl"><span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Combinaciones populares</span>
                            </h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CombinacionesPopularesChart mazos={torneo.mazos.map((mazo) => mazo.mazo)} />
                                <CombinacionesPopularesPieChart mazos={torneo.mazos.map((mazo) => mazo.mazo)} />
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