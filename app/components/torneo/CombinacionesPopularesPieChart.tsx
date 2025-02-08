"use client";

import { Mazo } from "@prisma/client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CombinacionesPopularesPieChart({ mazos }: { mazos: Mazo[] }) {
    const combinacionesPopulares = mazos.reduce((acc: Record<string, number>, mazo) => {
        const combinacion = mazo.subtipo1 + ' / ' + mazo.subtipo2;
        acc[combinacion] = (acc[combinacion] || 0) + 1;
        return acc;
    }, {});

    const series = Object.values(combinacionesPopulares);
    const labels = Object.keys(combinacionesPopulares);

    const options: ApexOptions = {
        chart: {
            type: "pie",
            fontFamily: "Inter, sans-serif",
            toolbar: { show: false },
        },
        labels: labels,
        dataLabels: { enabled: true },
        legend: {
            position: "bottom",
            labels: {
                colors: "#9ca3af",
            },
        },
        tooltip: {
            enabled: false,
        },
        colors: ["#243674", "#be1523", "#961a7f", "#f0941d", "#08683a"],
        stroke: {
            show: false,
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="pie" height={350} />
        </div>
    );
}
