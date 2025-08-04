import { prisma } from "./db/prisma";
import { Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartasPopulares from "./components/carta/CartasPopulares";
import CartaHeader from "./components/carta/CartaHeader";
import CombinacionesPopularesChart from "./components/torneo/CombinacionesPopularesChart";
import SubtiposPopularesChart from "./components/torneo/SubtiposPopularesChart";

export default async function Cartas() {
  const cartas = await prisma.carta.findMany();

  const ultimos5Torneos = await prisma.torneo.findMany({
    orderBy: {
      fecha: 'desc',
    },
    take: 13,
    select: {
      id: true,
    },
  });

  const torneosIds = ultimos5Torneos.map(torneo => torneo.id);
  const mazos = await prisma.mazo.findMany({
    where: {
      torneos: {
        some: {
          torneoId: { in: torneosIds },
        },
      },
    },
  });
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <CartaHeader cartas={cartas} />
      </Suspense >
      <div className="relative bg-[#111827] mt-5 mb-5">
        {/* Capa de fondo degradado que ocupa todo el ancho y altura */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-[#641717] via-[#5f2a14] to-[#7d4a11] opacity-50 blur-2xl" />
        </div>

        {/* Contenido centrado con carta y borde */}
        <div className="relative z-10 flex items-center justify-center ">
          {/* Aura más cercana a la carta */}
          <div className="relative p-4">
            <img
              src="/yoro.png"
              alt="Yorō, leyenda del fin"
              className="relative z-10 w-[280px] sm:w-[320px] md:w-[360px] rounded-xl"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        <div>
          <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl"><span
            className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Combinaciones populares de subtipos</span>
          </h1>
          <div className="">
            <CombinacionesPopularesChart mazos={mazos.map((mazo) => mazo)} />
          </div>
        </div>
        <div>
          <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl"><span
            className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Subtipos populares</span>
          </h1>
          <div className="">
            <SubtiposPopularesChart mazos={mazos.map((mazo) => mazo)} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 p-4 pt-0 gap-4">
        <div className="">
          <CartasPopulares section="reino" title="Cartas populares del reino" />
        </div>
        <div className="">
          <CartasPopulares section="boveda" title="Cartas populares de la bóveda" />
        </div>
      </div>
    </>
  );
}
