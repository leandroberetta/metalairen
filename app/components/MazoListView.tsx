import { MazoSection } from "./MazoSection";
import { Mazo } from "./MazoBuilder";
import MazoCostesChart from "./MazoCostesChart";

export default function MazoGridView({ mazo, subtipo1, subtipo2, nombre, bovedaPuntos }: {
    mazo: Mazo,
    subtipo1?: string | null,
    subtipo2?: string | null,
    nombre?: string | null,
    bovedaPuntos?: number
}) {

    return (
        <div>
            <div className="flex flex-row">
                <div className="grow">
                    <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                            {nombre}
                        </span>
                    </h1>
                </div>
                <div>
                    <div>
                        <h2 className="text-xl dark:text-white font-extrabold text-gray-900">
                            {subtipo1 && subtipo2 && `${subtipo1} / ${subtipo2}`}
                        </h2>
                    </div>
                    <div className="my-4 justify-end flex">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Dominación</span>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="my-4 mt-0 h-full">
                    <MazoCostesChart mazo={mazo} />
                </div>
               
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="">
                    <MazoSection nombre="Reino" sectionKey="reino" section={mazo.reino} viewMode={true} />
                </div>
                <div className="">
                    <MazoSection nombre="Bóveda" sectionKey="boveda" section={mazo.boveda} viewMode={true} bovedaPuntos={bovedaPuntos} />
                </div>
                <div className="">
                    <MazoSection nombre="Sidedeck" sectionKey="sidedeck" section={mazo.sideboard} viewMode={true} />
                </div>
            </div>

        </div >
    );

}