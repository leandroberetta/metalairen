"use client"

import clsx from 'clsx';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathName = usePathname();

    return (
        <div className="mx-auto p-4">
            <nav className="dark:bg-gray-900">
                <div className="flex flex-wrap items-center justify-between">
                    <Link href="/" className="flex items-center mr-4">
                        <h1 className="text-4xl font-extrabold dark:text-white md:text-4xl lg:text-4xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-yellow-300">MetaLairen</span>
                        </h1>
                    </Link>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <Link href="/" className={clsx('block py-2 px-3 rounded md:bg-transparent md:p-0 dark:text-white hover:dark:text-yellow-400', { 'md:dark:text-yellow-400': pathName === '/' })}>Cartas</Link>
                            </li>
                            <li>
                                <Link href="/mazos" className={clsx('block py-2 px-3 rounded md:bg-transparent md:p-0 dark:text-white hover:dark:text-yellow-400', { 'md:dark:text-yellow-400': pathName === '/mazos' })}>Mazos</Link>
                            </li>
                            {/*
                            <li>
                                <Link href="/torneos" className={clsx('block py-2 px-3 rounded md:bg-transparent md:p-0 dark:text-white hover:dark:text-yellow-400', { 'md:dark:text-yellow-400': pathName === '/torneos' })}>Torneos</Link>
                            </li>
                            */}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}