"use client";

import clsx from "clsx";
import { Tooltip } from "flowbite-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React from "react";

export default function SearchBar({ filters }: { filters?: React.ReactNode }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [busquedaAvanzada, setBusquedaAvanzada] = React.useState(false);

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="mx-auto">
            <div className=" mx-auto flex pb-4">
                <div className="grow">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                            <svg
                                className="h-4 w-4 text-gray-500 dark:text-gray-400"

                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded border p-4 ps-10 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:shadow dark:shadow-gray-800 focus:ring-0 focus:outline-none"
                            placeholder="Buscar..."
                            onChange={(e) => {
                                handleSearch(e.target.value);
                            }}
                            defaultValue={searchParams.get("query")?.toString()}
                        />
                    </div>
                </div>
                {filters && <Tooltip content="Búsqueda avanzada">
                    <button onClick={() => setBusquedaAvanzada(!busquedaAvanzada)}
                        className={clsx("h-full ml-3 rounded bg-yellow-300 px-5 py-3 text-center text-base text-sm font-medium font-medium text-white dark:shadow hover:bg-yellow-400 dark:focus:outline-none dark:text-gray-700 dark:shadow dark:shadow-gray-800", { "bg-yellow-400": busquedaAvanzada })}>
                        <svg
                            className="h-6 w-6 dark:text-gray-700"

                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
                            />
                        </svg>
                    </button>
                </Tooltip>}
            </div>
            {busquedaAvanzada && filters}
        </div>
    );
}
