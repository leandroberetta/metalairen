"use client";

import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { MazoTemporal } from './MazoBuilder';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Serie {
    name: string;
    color: string;
    data: { x: string, y: number }[];
}

export default function MazoCostesChart({ mazo, hideTitle = true }: { mazo: MazoTemporal, hideTitle?: boolean }) {
    const [series, setSeries] = useState<Serie[]>([
        { name: "Unidades", color: "#243674", data: [] },
        { name: "Acciones", color: "#961a7f", data: [] },
        { name: "Acciones rápidas", color: "#be1523", data: [] },
        { name: "Armas", color: "#08683a", data: [] },
        { name: "Monumentos", color: "#f0941d", data: [] },
    ]);

    useEffect(() => {
        const conteos: Record<string, Record<string, number>> = {
            "Unidades": { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7+": 0 },
            "Acciones": { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7+": 0 },
            "Acciones rápidas": { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7+": 0 },
            "Armas": { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7+": 0 },
            "Monumentos": { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7+": 0 },
        };

        mazo.reino.forEach((carta) => {
            const costeKey = carta.coste >= 7 ? "7+" : String(carta.coste);

            if (carta.tipo === 'UNIDAD') {
                conteos["Unidades"][costeKey]++;
            } else if (carta.tipo === 'ACCION' && carta.subtipo3 === 'RAPIDA') {
                conteos["Acciones rápidas"][costeKey]++;
            } else if (carta.tipo === 'ACCION') {
                conteos["Acciones"][costeKey]++;
            } else if (carta.tipo === 'ARMA') {
                conteos["Armas"][costeKey]++;
            } else {
                conteos["Monumentos"][costeKey]++;
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
            padding: { top: -30, left: 2, right: 2 },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { show: false },
        fill: { opacity: 1 },
    };

    return (
        <div>
            {!hideTitle && <div className="flex">
                <h4 className="text-xl font-bold dark:text-white flex-grow">Composición del reino por costes</h4>
            </div>}
            <ReactApexChart options={options} series={series} type="bar" height="300" />
        </div>
    );
}
