import { prisma } from "./db/prisma";
import { Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartasPopulares from "./components/carta/CartasPopulares";
import CartaHeader from "./components/carta/CartaHeader";

export default async function Cartas() {
  const cartas = await prisma.carta.findMany();

  return (
    <>
      <div className="p-4 m-4  text-sm text-blue-800 rounded bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
        <span className="font-medium">Atención!</span> Estas en la nueva versión de MetaLairen. Si necesitas acceder a la versión anterior, podés encontrarla en https://old.metalairen.com.ar, estará disponible hasta el 07/02/25.
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <CartaHeader cartas={cartas} />
      </Suspense >
      <CartasPopulares section="reino" title="Cartas populares del reino" />
      <CartasPopulares section="boveda" title="Cartas populares de la bóveda" />
    </>
  );
}
