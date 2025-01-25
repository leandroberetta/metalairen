"use client";

import Link from "next/link";
import React from "react";
import { MazoConUsuario } from "./MazosCompartidos";

export default function MazoList({ mazos, linkEdit = false }: { mazos: MazoConUsuario[], linkEdit?: boolean }) {
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
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input checked={mazo.publico ? true : false} readOnly={true} type="checkbox" className="sr-only peer" />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400 dark:peer-checked:bg-yellow-400"></div>
                                        </label>
                                    </td>
                                }
                                {!linkEdit &&
                                    <td className="px-6 py-4">
                                        {mazo.usuario.nombre}
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