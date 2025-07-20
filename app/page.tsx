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
    take: 11,
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
