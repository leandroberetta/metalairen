import Select from "./Select";

export default function TorneoFilters() {
    return (
        <>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-xl mt-4">
                <span className="bg-gradient-to-r from-black to-yellow-300 bg-clip-text text-transparent dark:from-white dark:to-yellow-300">Búsqueda avanzada</span>
            </h1>
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-2">
                <div className="">
                    <Select options={{
                        "Buenos Aires": "Buenos Aires",
                        "Catamarca": "Catamarca",
                        "Chaco": "Chaco",
                        "Chubut": "Chubut",
                        "Córdoba": "Córdoba",
                        "Corrientes": "Corrientes",
                        "Entre Ríos": "Entre Ríos",
                        "Formosa": "Formosa",
                        "Jujuy": "Jujuy",
                        "La Pampa": "La Pampa",
                        "La Rioja": "La Rioja",
                        "Mendoza": "Mendoza",
                        "Misiones": "Misiones",
                        "Neuquén": "Neuquén",
                        "Salta": "Salta",
                        "San Juan": "San Juan",
                        "San Luis": "San Luis",
                        "Santa Cruz": "Santa Cruz",
                        "Santa Fe": "Santa Fe",
                        "Santiago del Estero": "Santiago del Estero",
                        "Tierra del Fuego": "Tierra del Fuego",
                        "Tucumán": "Tucumán"
                    }} label={"Provincias"} parameter="provincias" />
                </div>
            </div>
        </>
    );
};
