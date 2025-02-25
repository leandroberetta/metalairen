import Select from "../Select";

export default function MazoParameros({ nombre, onCambiarNombre, publico, onCambiarPublico, formato, onCambiarFormato }: { nombre: string, onCambiarNombre: (nombre: string) => void, publico: boolean, onCambiarPublico: (publico: boolean) => void, formato: string | null, onCambiarFormato: (option: string | null) => void }) {
    return (
        <div className="">
            <h4 className="text-xl font-bold dark:text-white flex-grow mb-4">Configuración del mazo</h4>
            <div className="flex items-center mb-2">
                <label className="inline-flex items-center cursor-pointer">
                    <span className="me-2 text-sm font-medium text-gray-900 dark:text-white">Público</span>
                    <input checked={publico ? true : false} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCambiarPublico(e.target.checked)} type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400 dark:peer-checked:bg-yellow-400"></div>
                </label>
            </div>
            <div className="mb-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Formato</label>
                <Select onChangeHandler={onCambiarFormato} allowMultipleSelections={false} options={{
                    "DOMINACION": "Dominación",
                    "TRUE_ETHERNAL": "True Ethernal",
                }} label={"Formato"} parameter="formato" />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                <input value={nombre} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCambiarNombre(e.target.value)} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-yellow-400 dark:focus:border-yellow-400 me-2" placeholder="Nombre..." required />
            </div>
        </div>
    );
}