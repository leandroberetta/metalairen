import { prisma } from "../db/prisma";
import MazoBuilder from "../components/MazoBuilder";
import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default async function Mazos() {
    const cartas = await prisma.carta.findMany({
        where: {
          expansion: {
            not: "FUNDAMENTOS"
          },
          prohibida: false
        }
      });

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <MazoBuilder cartas={cartas} />
        </Suspense>
    );
}