import MazoSearch from "./MazoSearch";
import { Mazo } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/app/db/prisma";
import CrearMazoButton from "./CrearMazoButton";

export type MazoConUsuario = Mazo & {
    usuario: {
        nombre: string;
    };
};

export default async function MazosPublicos() {
    const session = await auth();
    const email = session?.user?.email;
    let mazos: MazoConUsuario[] = [];
    if (email) {
        const usuario = await prisma.usuario.findFirst({
            where: { email },
        });
        if (usuario) {
            mazos = await prisma.mazo.findMany({
                where: { publico: true, usuarioId: { not: usuario.id } },
                include: { cartas: true, usuario: true },
                orderBy: { id: 'desc' },
            });
        }
    } else {
        mazos = await prisma.mazo.findMany({
            where: { publico: true },
            include: { cartas: true, usuario: true },
            orderBy: { id: 'desc' },
        });
        console.log(mazos);
    }

    return (
        <>
            <div className="flex flex-row">
                <div className="grow">
                    <h1 className="mb-8 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                            Mazos compartidos
                        </span>
                    </h1>
                </div>
                {!session && (
                    <div className="h-full">
                        <CrearMazoButton />
                    </div>
                )}
            </div>
            <MazoSearch mazos={mazos} />
        </>
    );
}