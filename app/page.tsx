import { prisma } from "./db/prisma";
import { Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartasPopulares from "./components/carta/CartasPopulares";
import CartaHeader from "./components/carta/CartaHeader";
import CombinacionesPopularesChart from "./components/torneo/CombinacionesPopularesChart";
import CombinacionesPopularesPieChart from "./components/torneo/CombinacionesPopularesPieChart";

export default async function Cartas() {
  const cartas = await prisma.carta.findMany();

  const ultimos5Torneos = await prisma.torneo.findMany({
    orderBy: {
      fecha: 'desc',
    },
    take: 4,
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
      <div className="p-4 pt-0">
        {mazos.length > 0 &&
          <>
            <h1 className="mb-4 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white"><span
              className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">Combinaciones populares de subtipos</span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CombinacionesPopularesChart mazos={mazos.map((mazo) => mazo)} />
              <CombinacionesPopularesPieChart mazos={mazos.map((mazo) => mazo)} />
            </div>
          </>
        }
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
