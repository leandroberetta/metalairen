"use client";

import { Carta } from "@prisma/client";
import { Mazo } from "./MazoBuilder";
import MazoReinoCartaGrid from "./MazoReinoCartaGrid";
import MazoBovedaCartaGrid from "./MazoBovedaCartaGrid";
import MazoSideboardCartaGrid from "./MazoSideboardCartaGrid";
import MazoTiposChart from "./MazoTiposChart";
import MazoCostesChart from "./MazoCostesChart";

const reduceSection = (cartas: Carta[]): (Carta & { cantidad: number })[] => {
    return Object.values(
        cartas.reduce((acc: Record<number, Carta & { cantidad: number }>, carta) => {
            if (acc[carta.id]) {
                acc[carta.id].cantidad++;
            } else {
                acc[carta.id] = { ...carta, cantidad: 1 };
            }
            return acc;
        }, {})
    );
};

export default function MazoGridView({ mazo, subtipo1, subtipo2, nombre, bovedaPuntos }: {
    mazo: Mazo,
    subtipo1?: string | null,
    subtipo2?: string | null,
    nombre?: string | null,
    bovedaPuntos?: number
}) {

    const reinoReduced = reduceSection(mazo.reino);
    const sideboardReduced = reduceSection(mazo.sideboard);
    const bovedaReduced = reduceSection(mazo.boveda);

    return (
        <div className="">
            <div className="flex flex-col sm:flex-row">
                <div className="grow">
                    <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                            {nombre}
                        </span>
                    </h1>
                    <div>
                        <h2 className="text-xl dark:text-white font-extrabold text-gray-900">
                            {subtipo1 && subtipo2 && `${subtipo1} / ${subtipo2}`}
                        </h2>
                    </div>
                    <div className="mt-4">
                        <span className="bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Dominación</span>
                    </div>
                </div>
                <div className="flex items-stretch gap-4">
                    <div className="my-4 mt-0 h-full">
                        <MazoCostesChart mazo={mazo} />
                    </div>
                    <div className="my-4 mt-0 h-full">
                        <MazoTiposChart mazo={mazo} />
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-8 gap-4 mt-4">
                <div className="col-span-4">
                    <MazoReinoCartaGrid cartas={reinoReduced} />
                </div>
                <div className="col-span-3">
                    <MazoBovedaCartaGrid cartas={bovedaReduced} bovedaPuntos={bovedaPuntos} />
                </div>
                <div className="">
                    <MazoSideboardCartaGrid cartas={sideboardReduced} />
                </div>
            </div>
        </div>
    );
}