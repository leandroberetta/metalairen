import { Tooltip } from "flowbite-react";
import Link from "next/link";

export default function CrearMazoButton() {
    return (
        <Tooltip content="Construir mazo">
            <Link
                href={{
                    pathname: '/mazo/crear',
                }}
                className="inline-flex items-center justify-center focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5"
            >
                <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                </svg>
            </Link>
        </Tooltip>
    );
}