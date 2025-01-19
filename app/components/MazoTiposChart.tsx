"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Mazo } from "./MazoBuilder";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Serie {
    tipo: string,
    cantidad: number
}

export default function MazoTiposChart({ mazo }: { mazo: Mazo }) {
    const [series, setSeries] = useState<Serie[]>([]);

    useEffect(() => {
        const conteos: Record<string, number> = {
            "UNIDAD": 0,
            "ACCION": 0,
            "ACCION_RAPIDA": 0,
            "ARMA": 0,
            "MONUMENTO": 0,
        };

        mazo.reino.forEach((carta) => {
            if (carta.tipo === 'UNIDAD') {
                conteos["UNIDAD"]++;
            } else if (carta.tipo === 'ACCION' && carta.subtipo3 === 'RAPIDA') {
                conteos["ACCION_RAPIDA"]++;
            } else if (carta.tipo === 'ACCION') {
                conteos["ACCION"]++;
            } else if (carta.tipo === 'ARMA') {
                conteos["ARMA"]++;
            } else {
                conteos["MONUMENTO"]++;
            }
        });

        setSeries(Object.keys(conteos).map((tipo) => ({
            tipo: tipo,
            cantidad: conteos[tipo]
        })))
    }, [mazo]);

    const options: ApexOptions = {
        colors: ["#243674", "#961a7f", "#be1523", "#08683a", "#f0941d"],
        chart: {
            type: "pie",
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -15,
                },
            },
        },
        stroke: {
            show: false,
        },
        labels: ["Unidades", "Acciones", "Acciones rápidas", "Armas", "Monumentos"],
        dataLabels: {
            enabled: false,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        tooltip: {
            fillSeriesColor: false,
        },
        legend: {
            show: false,
            horizontalAlign: "center",
            position: "right",
            fontFamily: "Inter, sans-serif",
            labels: {
                colors: "white",
            },
            markers: {
                strokeWidth: 0,
                offsetX: -5,
            }
        },
    };

    return (
        <div>
            <ReactApexChart
                options={options}
                series={series.map((serie) => serie.cantidad)}
                type="pie"
                width={200}
                height={120}
            />
        </div>
    );
}