import Select from "../Select";

export default function CardFilters() {
    return (
        <>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-xl ">
                <span className="bg-gradient-to-r from-black to-yellow-300 bg-clip-text text-transparent dark:from-white dark:to-yellow-300">Búsqueda avanzada</span>
            </h1>
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-2">
                <div className="">
                    <Select options={{
                        "FUNDAMENTOS": "Fundamentos",
                        "PACTO SECRETO": "Pacto secreto",
                        "TRONO COMPARTIDO": "Trono compartido",
                        "IMPERIO": "Imperio",
                        "ANCESTROS": "Ancestros"
                    }} label={"Expansiones"} parameter="expansiones" />
                </div>
                <div className="">
                    <Select options={{
                        "DOMINACION": "Dominación",
                        "ETHERNAL": "Ethernal",
                    }} label={"Formatos"} parameter="formatos" />
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
                    }} label={"Tipos"} parameter="tipos" />
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
                    }} label={"Subtipos"} parameter="subtipos" />
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
                    }} label={"Subtipos"} parameter="subtipos2" />
                </div>
                <div className="">
                    <Select options={{
                        "REALEZA": "Realeza"
                    }} label={"Supertipos"} parameter="supertipos" />
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
                    }} label={"Costes"} parameter="costes" />
                </div>
                <div className="">
                    <Select options={{
                        "BRONCE": "Bronce",
                        "PLATA": "Plata",
                        "ORO": "Oro",
                        "DIAMANTE": "Diamante",
                        "ESMERALDA": "Esmeralda",
                    }} label={"Rarezas"} parameter="rarezas" />
                </div>
            </div>
        </>
    );
};
