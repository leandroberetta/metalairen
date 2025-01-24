export default function MazoParameros({ nombre, onCambiarNombre, publico, onCambiarPublico }: { nombre: string, onCambiarNombre: (nombre: string) => void, publico: boolean, onCambiarPublico: (publico: boolean) => void }) {
    return (
        <div className="">
            <div className="flex items-center mb-4">
                <input checked={publico ? true : false} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCambiarPublico(e.target.checked)} id="default-checkbox" type="checkbox" value="" className="appearance-none w-4 h-4 border border-gray-300 rounded dark:focus:ring-0 dark:focus:ring-yellow-300 dark:focus:outline-none checked:dark:bg-yellow-300 checked:dark:text-gray-900" />
                <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Público</label>
            </div>
            <input value={nombre} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCambiarNombre(e.target.value)} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-300 dark:focus:border-yellow-300 me-2" placeholder="Nombre..." required />
        </div>
    );
}