"use client";

import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { Mazo } from './MazoBuilder';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Serie {
    name: string;
    color: string;
    data: { x: string, y: number }[];
}

export default function MazoCostesChart({ mazo, hideTitle = true }: { mazo: Mazo, hideTitle?: boolean }) {
    const [series, setSeries] = useState<Serie[]>([
        { name: "Unidades", color: "#243674", data: [] },
        { name: "Acciones", color: "#961a7f", data: [] },
        { name: "Acciones rápidas", color: "#be1523", data: [] },
        { name: "Armas", color: "#08683a", data: [] },
        { name: "Monumentos", color: "#f0941d", data: [] },
    ]);

    useEffect(() => {
        const conteos: Record<string, Record<string, number>> = {
            "Unidades": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
            "Acciones": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
            "Acciones rápidas": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
            "Armas": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
            "Monumentos": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
        };

        mazo.reino.forEach((carta) => {
            if (carta.tipo === 'UNIDAD') {
                conteos["Unidades"][String(carta.coste)]++;
            } else if (carta.tipo === 'ACCION' && carta.subtipo3 === 'RAPIDA') {
                conteos["Acciones rápidas"][String(carta.coste)]++;
            } else if (carta.tipo === 'ACCION') {
                conteos["Acciones"][String(carta.coste)]++;
            } else if (carta.tipo === 'ARMA') {
                conteos["Armas"][String(carta.coste)]++;
            } else {
                conteos["Monumentos"][String(carta.coste)]++;
            }
        });

        setSeries((prevSeries) =>
            prevSeries.map((serie) => ({
                ...serie,
                data: Object.keys(conteos[serie.name])
                    .map((coste) => ({
                        x: coste,
                        y: conteos[serie.name][coste],
                    })),
            }))
        );
    }, [mazo]);

    const options: ApexOptions = {
        colors: ["#243674", "#961a7f", "#be1523", "#f0941d", "#08683a"],
        chart: {
            fontFamily: "Inter, sans-serif",
            toolbar: { show: false },
            stacked: true,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "70%",
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            enabled: true,
            style: {
                fontFamily: "Inter, sans-serif",
            },
            theme: "dark",
        },
        states: {
            hover: {
                filter: { type: "lighten" },
            },
        },
        stroke: {
            show: true,
            width: 0,
            colors: ["transparent"],
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: { left: 2, right: 2, top: -14 },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            labels: {
                show: false,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: true },
        },
        yaxis: { show: false },
        fill: { opacity: 1 },
    };

    return (
        <div>
            {!hideTitle && <div className="flex">
                <h4 className="text-xl font-bold dark:text-white flex-grow">Composición del reino por costes</h4>
            </div>}
            <ReactApexChart options={options} series={series} type="bar" height={100} />
        </div>
    );
}
