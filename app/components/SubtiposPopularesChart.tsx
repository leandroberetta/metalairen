"use client";

import { Mazo } from "@prisma/client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Serie {
    data: { x: string, y: number }[];
}

export default function SubtiposPopularesChart({ mazos }: { mazos: Mazo[] }) {
    const subtiposPopulares = mazos.reduce((acc: Record<string, number>, mazo) => {
        if (mazo.subtipo1) {
            if (acc[mazo.subtipo1]) {
                acc[mazo.subtipo1]++;
            } else {
                acc[mazo.subtipo1] = 1;
            }
        }
        if (mazo.subtipo2) {
            if (acc[mazo.subtipo2]) {
                acc[mazo.subtipo2]++;
            } else {
                acc[mazo.subtipo2] = 1;
            }
        }
        return acc;
    }, {});

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
            show: true,
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

    const series: Serie[] = [{
        data: Object.keys(subtiposPopulares).map((subtipo) => ({
            x: subtipo, y: subtiposPopulares[subtipo]
        }))
    }];

    return (
        <div className="p-4 pt-0">
            <h1 className="mb-8 text-3xl font-extrabold text-gray-900 dark:text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                    Subtipos populares
                </span>
            </h1>
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    );
}