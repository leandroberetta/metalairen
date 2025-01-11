import { prisma } from "../db/prisma";
import MazoBuilder from "../components/MazoBuilder";

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
        <MazoBuilder cartas={cartas} />
    );
}