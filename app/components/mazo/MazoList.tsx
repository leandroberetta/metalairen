"use client";

import { Mazo } from "@prisma/client";
import Link from "next/link";
import React from "react";

export default function MazoList({ mazos, linkEdit = false }: { mazos: Mazo[], linkEdit?: boolean }) {
    return (
        <div>
            <div className="relative overflow-x-auto shadow dark:shadow dark:shadow-gray-800 rounded" >
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
                            {linkEdit &&
                                <th scope="col" className="px-6 py-3">
                                    Público
                                </th>
                            }
                            {!linkEdit &&
                                <th scope="col" className="px-6 py-3">
                                    Usuario
                                </th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {mazos.map((mazo) => (
                            <tr key={mazo.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <h5 className="text-xl font-bold">
                                        <Link href={linkEdit ? `/mazo/editar/${mazo.id}` : `/mazo/ver/${mazo.id}`} className="font-medium text-yellow-300 hover:text-yellow-400">
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
                                {linkEdit &&
                                    <td className="px-6 py-4">
                                        <input readOnly={true} checked={mazo.publico ? true : false} id="default-checkbox" type="checkbox" value="" className="appearance-none w-4 h-4 border border-gray-300 rounded dark:focus:ring-0 dark:focus:outline-none checked:dark:bg-yellow-300 dark:checked:text-gray-900" />
                                    </td>
                                }
                                {!linkEdit &&
                                    <td className="px-6 py-4">
                                        {mazo.usuarioId}
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}