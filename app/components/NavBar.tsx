"use client"

import clsx from 'clsx';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect } from 'react';
import { initFlowbite } from 'flowbite';

export default function Navbar() {
    const pathName = usePathname();
    const { data: session, status } = useSession();
    useEffect(() => {
        initFlowbite();
    });
    return (
        <div className="mx-auto p-4">
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className=" flex flex-wrap items-center justify-between mx-auto">
                    <Link href="/" className="flex items-center mr-4">
                        <h1 className="text-4xl font-extrabold dark:text-white md:text-4xl lg:text-4xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-yellow-300">MetaLairen</span>
                        </h1>
                    </Link>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {status === 'authenticated' && (
                            <>
                                <button type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-yellow-300 dark:focus:ring-yellow-400" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                                    <span className="sr-only">Open user menu</span>
                                    {session.user?.image && (
                                        <Image
                                            src={session.user.image}
                                            alt={`${session.user.name}'s profile`}
                                            width={40}
                                            height={40}
                                            style={{ borderRadius: '50%' }}
                                        />)
                                    }
                                </button>
                                <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                                    <div className="px-4 py-3">
                                        <span className="block text-sm text-gray-900 dark:text-white">{session.user?.name}</span>
                                        <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">{session.user?.email}</span>
                                    </div>
                                    <ul className="py-2" aria-labelledby="user-menu-button">
                                        <li>
                                            <a onClick={() => { signOut() }} href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Cerrar sesión</a>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                        {status === 'unauthenticated' && (
                            <ul className="items-center font-bold flex p-0 hidden md:block border border-gray-100 rounded-lg bg-gray-50 flex-row space-x-8 rtl:space-x-reverse mt-0 border-0 bg-white dark:bg-gray-900 dark:border-gray-700">
                                <li>
                                    <button className="block py-2 px-3 rounded md:bg-transparent md:p-0 dark:text-white hover:dark:text-yellow-400" onClick={() => signIn()}>Iniciar sesión</button>
                                </li>
                            </ul>
                        )}
                        <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <Link href="/" className={clsx('block py-2 px-3 rounded md:bg-transparent md:p-0 dark:text-white hover:dark:text-yellow-400', { 'md:dark:text-yellow-400': pathName === '/' })}>Cartas</Link>
                            </li>
                            <li>
                                <Link href="/mazos" className={clsx('block py-2 px-3 rounded md:bg-transparent md:p-0 dark:text-white hover:dark:text-yellow-400', { 'md:dark:text-yellow-400': pathName === '/mazos' })}>Mazos</Link>
                            </li>
                            <li>
                                <Link href="/torneos" className={clsx('block py-2 px-3 rounded md:bg-transparent md:p-0 dark:text-white hover:dark:text-yellow-400', { 'md:dark:text-yellow-400': pathName === '/torneos' })}>Torneos</Link>
                            </li>
                            {status === 'unauthenticated' && (
                                <li>
                                    <button className="md:hidden block py-2 px-3 rounded md:bg-transparent md:p-0 dark:text-white hover:dark:text-yellow-400" onClick={() => signIn()}>Iniciar sesión</button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}