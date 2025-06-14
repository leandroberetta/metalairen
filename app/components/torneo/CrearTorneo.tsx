"use client"

import { useState } from "react";

export default function CrearTorneo(
    { onCrearTorneo }: {
        onCrearTorneo(
            nombre: string,
            sede: string,
            provincia: string,
            fecha: string,
            oficial: boolean): Promise<{ torneoId?: number; error?: string }>
    }) {
    const [nombre, setNombre] = useState<string>("");
    const [sede, setSede] = useState<string>("");
    const [provincia, setProvincia] = useState<string>("");
    const [fecha, setFecha] = useState<string>("");
    const [oficial, setOficial] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleCrearTorneo = async () => {
        if (!nombre) {
            setErrors(prevErrors => ({ ...prevErrors, nombre: "El campo nombre es obligatorio." }))
        } else {
            setErrors(prevErrors => {
                const { nombre, ...rest } = prevErrors
                return rest;
            });
        }
        if (!sede) {
            setErrors(prevErrors => ({ ...prevErrors, sede: "El campo sede es obligatorio." }))
        } else {
            setErrors(prevErrors => {
                const { sede, ...rest } = prevErrors
                return rest;
            });
        }
        if (!provincia) {
            setErrors(prevErrors => ({ ...prevErrors, provincia: "El campo provincia es obligatorio." }))
        } else {
            setErrors(prevErrors => {
                const { provincia, ...rest } = prevErrors
                return rest;
            });
        }
        if (!fecha) {
            setErrors(prevErrors => ({ ...prevErrors, fecha: "El campo fecha es obligatorio." }))
        } else {
            setErrors(prevErrors => {
                const { fecha, ...rest } = prevErrors
                return rest;
            });
        }

        if (Object.keys(errors).length === 0) {
            const {torneoId, error} = await onCrearTorneo(nombre, sede, provincia, fecha, oficial);
            console.log(torneoId);
            console.log(error);
        } else {
            console.log("Errores:", errors);
        }
    };

    return (
        <div className="p-4 pt-0">
            <h1 className=" text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                    Crear torneo
                </span>
            </h1>
            <div className="grid gap-6 mb-6 lg:grid-cols-2 pt-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNombre(e.target.value) }} type="text" id="torneo_nombre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-400 dark:focus:border-yellow-400" placeholder="" />
                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sede</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSede(e.target.value) }} type="text" id="torneo_nombre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-400 dark:focus:border-yellow-400" placeholder="" />
                    {errors.sede && <p className="text-red-500 text-sm mt-1">{errors.sede}</p>}
                </div>
            </div>
            <div className="grid gap-6 mb-6 lg:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Provincia</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setProvincia(e.target.value) }} type="text" id="torneo_nombre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-400 dark:focus:border-yellow-400" placeholder="" />
                    {errors.provincia && <p className="text-red-500 text-sm mt-1">{errors.provincia}</p>}
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setFecha(e.target.value); console.log(fecha); }} type="text" id="torneo_nombre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-400 dark:focus:border-yellow-400" placeholder="" />
                    {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
                </div>
            </div>
            <div className="grid gap-6 mb-6">
                <label className="inline-flex items-center cursor-pointer">
                    <span className="me-2 text-sm font-medium text-gray-900 dark:text-white">Oficial</span>
                    <input checked={oficial ? true : false} onChange={() => { setOficial(!oficial ? true : false) }} type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400 dark:peer-checked:bg-yellow-400"></div>
                </label>
            </div>
            <button onClick={() => { handleCrearTorneo() }} className="focus:outline-none dark:bg-yellow-300 dark:hover:bg-yellow-400 font-medium rounded text-sm px-2.5 py-2.5 me-2 text-gray-800">Crear</button>
        </div>
    );
}
