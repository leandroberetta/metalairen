import { Tooltip } from "flowbite-react";
import Select from "../Select";
import { use } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CardFilters() {
    const filtros = ['expansiones', 'formatos', 'tipos', 'subtipos', 'subtipos2', 'supertipos', 'costes', 'rarezas'];
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const onEliminarFiltros = () => {
        const params = new URLSearchParams(searchParams);
        filtros.forEach(filtro => {
            params.delete(filtro);
        });
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="flex">
                <div className="flex-grow">
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-xl ">
                        <span className="bg-gradient-to-r from-black to-yellow-300 bg-clip-text text-transparent dark:from-white dark:to-yellow-300">Búsqueda avanzada</span>
                    </h1>
                </div>
                <div>
                    <Tooltip content="Eliminar filtros" placement="top" arrow={false}>
                        <button onClick={() => onEliminarFiltros()}>
                            <svg className="w-6 h-6 dark:text-yellow-300 dark:hover:text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                            </svg>
                        </button>
                    </Tooltip>
                </div>
            </div>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-2">
                <div className="">
                    <Select options={{
                        "FUNDAMENTOS": "Fundamentos",
                        "PACTO SECRETO": "Pacto secreto",
                        "TRONO COMPARTIDO": "Trono compartido",
                        "IMPERIO": "Imperio",
                        "ANCESTROS": "Ancestros"
                    }} label={"Expansiones"} parameter={filtros[0]} />
                </div>
                <div className="">
                    <Select options={{
                        "DOMINACION": "Dominación",
                        "ETHERNAL": "Ethernal",
                    }} label={"Formatos"} parameter={filtros[1]} />
                </div>
                <div className="">
                    <Select options={{
                        "ACCION": "Acción",
                        "ACCION RAPIDA": "Acción Rápida",
                        "UNIDAD": "Unidad",
                        "TESORO": "Tesoro",
                        "MONUMENTO": "Monumento",
                        "ARMA": "Arma",
                        "FICHA": "Ficha"
                    }} label={"Tipos"} parameter={filtros[2]} />
                </div>
                <div className="">
                    <Select options={{
                        "ANIMAL": "Animal",
                        "BRUJA": "Bruja",
                        "DEMONIO": "Demonio",
                        "DESERTOR": "Desertor",
                        "DJINN": "Djinn",
                        "DRAGON": "Dragón",
                        "ELEMENTAL": "Elemental",
                        "ENANO": "Enano",
                        "ETERNO": "Eterno",
                        "GIGANTE": "Gigante",
                        "INSECTO": "Insecto",
                        "MAGO": "Mago",
                        "MIMETICO": "Mimético",
                        "MONJE": "Monje",
                        "PIRATA": "Pirata",
                        "SOLDADO": "Soldado",
                        "SIN_SUBTIPOS": "Sin subtipos"
                    }} label={"Subtipos"} parameter={filtros[3]} />
                </div>
                <div className="">
                    <Select options={{
                        "ANIMAL": "Animal",
                        "BRUJA": "Bruja",
                        "DEMONIO": "Demonio",
                        "DESERTOR": "Desertor",
                        "DJINN": "Djinn",
                        "DRAGON": "Dragón",
                        "ELEMENTAL": "Elemental",
                        "ENANO": "Enano",
                        "ETERNO": "Eterno",
                        "GIGANTE": "Gigante",
                        "INSECTO": "Insecto",
                        "MAGO": "Mago",
                        "MIMETICO": "Mimético",
                        "MONJE": "Monje",
                        "PIRATA": "Pirata",
                        "SOLDADO": "Soldado",
                    }} label={"Subtipos"} parameter={filtros[4]} />
                </div>
                <div className="">
                    <Select options={{
                        "REALEZA": "Realeza"
                    }} label={"Supertipos"} parameter={filtros[5]} />
                </div>
                <div className="">
                    <Select options={{
                        "0": "0",
                        "1": "1",
                        "2": "2",
                        "3": "3",
                        "4": "4",
                        "5": "5",
                        "6": "6",
                        "7": "7",
                        "8": "8",
                        "9": "9"
                    }} label={"Costes"} parameter={filtros[6]} />
                </div>
                <div className="">
                    <Select options={{
                        "BRONCE": "Bronce",
                        "PLATA": "Plata",
                        "ORO": "Oro",
                        "DIAMANTE": "Diamante",
                        "ESMERALDA": "Esmeralda",
                    }} label={"Rarezas"} parameter={filtros[7]} />
                </div>
            </div>
        </>
    );
};
