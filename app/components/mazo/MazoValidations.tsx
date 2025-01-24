export default function MazoValidations({ validationErrors }: { validationErrors: string[] }) {
    return (
        <div>
            {validationErrors && validationErrors.length > 0 &&
                <div className="flex p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:shadow" role="alert">
                    <div>
                        <span className="font-medium">Errores de validación:</span>
                        <ul className="mt-1.5 list-disc list-inside">
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
        </div>
    );
}