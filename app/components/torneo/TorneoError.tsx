export default function TorneoError() {
    return (
        <div className="p-4">
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">Atención!</span> El torneo no existe.
            </div>
        </div>
    );
}