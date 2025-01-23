"use client";

import { Mazo } from "@prisma/client";
import Link from "next/link";
import React from "react";

export default function MazoList({ mazos }: { mazos: Mazo[] }) {
    return (
        <div>
            <div className="relative overflow-x-auto shadow-xl dark:shadow-xl dark:shadow-gray-800 rounded" >
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nombre
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
                        {mazos.map((mazo) => (
                            <tr key={mazo.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <h5 className="text-xl font-bold">
                                        <Link href={`/mazo/ver/${mazo.id}`} className="font-medium text-yellow-300 hover:text-yellow-400">
                                            {mazo.nombre}
                                        </Link>
                                    </h5>
                                </th>
                                <td className="px-6 py-4">
                                    {mazo.subtipo1}
                                </td>
                                <td className="px-6 py-4">
                                    {mazo.subtipo2}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}