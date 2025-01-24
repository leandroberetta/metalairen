export default function MazoError() {
    return (
        <div className="p-4">
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">Atención!</span> El mazo no existe o no tenés permisos para verlo.
            </div>
        </div>
    );
}