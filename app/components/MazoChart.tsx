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

export default function MazoChart({ mazo, hideTitle = true }: { mazo: Mazo, hideTitle?: boolean }) {
    const [series, setSeries] = useState<Serie[]>([
        { name: "Unidad", color: "#243674", data: [] },
        { name: "Acción", color: "#961a7f", data: [] },
        { name: "Acción rápida", color: "#be1523", data: [] },
        { name: "Arma", color: "#08683a", data: [] },
        { name: "Monumento", color: "#f0941d", data: [] },
    ]);

    useEffect(() => {
        // Inicializa conteos
        const conteos: Record<string, Record<string, number>> = {
            "Unidad": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
            "Acción": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
            "Acción rápida": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
            "Arma": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
            "Monumento": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 },
        };

        mazo.reino.forEach((carta) => {
            if (carta.tipo === 'UNIDAD') {
                conteos["Unidad"][String(carta.coste)]++;
            } else if (carta.tipo === 'ACCION' && carta.subtipo3 === 'RAPIDA') {
                conteos["Acción rápida"][String(carta.coste)]++;
            } else if (carta.tipo === 'ACCION') {
                conteos["Acción"][String(carta.coste)]++;
            } else if (carta.tipo === 'ARMA') {
                conteos["Arma"][String(carta.coste)]++;
            } else {
                conteos["Monumento"][String(carta.coste)]++;
            }
        });

        setSeries((prevSeries) =>
            prevSeries.map((serie) => ({
                ...serie,
                data: Object.keys(conteos[serie.name]).map((coste) => ({
                    x: coste,
                    y: conteos[serie.name][coste],
                })),
            }))
        );
    }, [mazo]);

    const options: ApexOptions = {
        colors: ["#243674", "#961a7f", "#be1523", "#f0941d", "#08683a"],
        chart: {
            type: "bar",
            height: "100",
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
        tooltip: { enabled: false },
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
            floating: false,
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
        <div id="column-chart">
            {!hideTitle &&<div className="flex py-4">
                <h4 className="text-xl font-bold dark:text-white flex-grow">Composición del reino por costes</h4>
            </div>}
            <ReactApexChart options={options} series={series} type="bar" height={150} />
        </div>
    );
}
