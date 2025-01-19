"use client";

import { Mazo } from "@prisma/client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Serie {
    data: { x: string, y: number }[];
}

export default function CombinacionesPopularesChart({ mazos }: { mazos: Mazo[] }) {
    const combinacionesPopulares = mazos.reduce((acc: Record<string, number>, mazo) => {
        const combinacion = mazo.subtipo1 + ' / ' + mazo.subtipo2;
        if (acc[combinacion]) {
            acc[combinacion]++;
        } else {
            acc[combinacion] = 1;
        }
        return acc;
    }, {});

    const series: Serie[] = [{
        data: Object.keys(combinacionesPopulares).map((combinacion) => ({
            x: combinacion,
            y: combinacionesPopulares[combinacion],
        })),
    }];

    const options: ApexOptions = {
        chart: {
            fontFamily: "Inter, sans-serif",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                distributed: true,
            },
        },
        tooltip: {
            enabled: false,
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
        dataLabels: { enabled: true },
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
        yaxis: {
            show: false,
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
        fill: { opacity: 1 },
        colors: ["#243674", "#be1523", "#961a7f", "#f0941d", "#08683a"],
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    );
}