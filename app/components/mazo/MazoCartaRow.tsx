import clsx from "clsx";
import { Tooltip } from "flowbite-react";
import { CartaCantidad } from "./MazoSection";

export default function MazoCartaRow({ carta, section, onPlusClick, onMinusClick, onSideboardClick, viewMode = false, onCartaClick }: {
    carta: CartaCantidad,
    section: string,
    onPlusClick?: (carta: CartaCantidad) => void,
    onMinusClick?: (carta: CartaCantidad) => void
    onSideboardClick?: (carta: CartaCantidad, fromSection: string) => void,
    onCartaClick?: (carta: CartaCantidad) => void,
    viewMode?: boolean
}) {
    return (
        <div className="flex gap-1">
            <span className="bg-yellow-100 text-yellow-800 text-md font-medium px-2.5 py-0.5 rounded dark:bg-yellow-300 dark:shadow-gray-800 flex items-center justify-center">
                {carta.cantidad}
            </span>

            <button onClick={() => onCartaClick && onCartaClick(carta)} className="flex-grow item-mazo rounded text-white shadow-xl dark:shadow-xl dark:shadow-gray-800"
                style={{ backgroundImage: `url(${carta.imagen})` }}>
                <p className="">{carta.nombre}</p>
            </button>
            {!viewMode && (
                (section === "reino" || section === "boveda") && (
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        {section === "boveda" && <span className="me-1 content-center text-md rounded bg-gray-200 px-2.5 py-0.5 font-medium text-white shadow-xl dark:text-gray-700 dark:shadow-xl dark:shadow-gray-800">{carta.costeBoveda}P</span>}
                        <button onClick={() => onMinusClick && onMinusClick(carta)} type="button" className={clsx("px-1 text-sm font-medium dark:text-gray-800 dark:bg-yellow-300 rounded-s dark:hover:bg-yellow-400 border-0", { "rounded": (section === "boveda" && carta.nombre !== "TESORO GENERICO") })}>
                            <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
                            </svg>
                        </button>
                        {(section === "reino" || carta.nombre === "TESORO GENERICO") && (
                            <button onClick={() => onPlusClick && onPlusClick(carta)} type="button" className="px-1 text-sm font-medium dark:text-gray-800 dark:bg-yellow-300 rounded-e dark:hover:bg-yellow-400 border-0">
                                <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                                </svg>
                            </button>
                        )}
                    </div>
                )
            )}
            {!viewMode && (
                section !== "boveda" && (
                    <Tooltip content={section === 'reino' ? 'Mover al sidedeck' : 'Mover al reino'}>

                        <button onClick={() => onSideboardClick && onSideboardClick(carta, section)} type="button" className="h-full px-1 text-sm font-medium dark:text-gray-800 dark:bg-yellow-300 rounded dark:hover:bg-yellow-400 border-0">
                            {section === "reino"
                                ?
                                <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 14-4-4m4 4 4-4" />
                                </svg>
                                :
                                <svg className="w-6 h-6 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v13m0-13 4 4m-4-4-4 4" />
                                </svg>
                            }
                        </button>
                    </Tooltip>
                )
            )}
        </div>
    );
}