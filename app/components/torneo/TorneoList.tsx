import { Torneo } from "@prisma/client";
import Link from "next/link";

export default function TorneoList({ torneos }: { torneos: Torneo[] }) {
    return (
        <div>
            <div className="relative overflow-x-auto shadow dark:shadow dark:shadow-gray-800 rounded" >
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Torneo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Sede
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Provincia
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Fecha
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {torneos.map((torneo) => (
                            <tr key={torneo.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <h5 className="text-xl font-bold">
                                        <Link href={`/torneos/${torneo.id}`} className="font-medium text-yellow-300 hover:text-yellow-400">
                                            {torneo.nombre}
                                        </Link>
                                    </h5>
                                </th>
                                <td className="px-6 py-4">
                                    { torneo.sede }
                                </td>
                                <td className="px-6 py-4">
                                    { torneo.provincia}
                                </td>
                                <td className="px-6 py-4">
                                    { torneo.fecha.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: '2-digit',}) } 
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}