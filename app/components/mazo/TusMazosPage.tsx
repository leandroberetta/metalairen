import MazoSearch from "./MazoSearch";
import { auth } from "@/auth";
import { prisma } from "@/app/db/prisma";
import CrearMazoButton from "./CrearMazoButton";
import MazoError from "./MazoError";

export default async function TusMazosPage() {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
        return <MazoError />;
    }

    const usuario = await prisma.usuario.findFirst({
        where: { email },
    });

    if (!usuario) {
        return <div>No se encontró el usuario en la base de datos</div>;
    }

    const mazos = await prisma.mazo.findMany({
        where: { usuarioId: usuario.id },
        include: { cartas: true },
        orderBy: { id: 'desc' },
    });
    return (
        <>
            <div className="flex flex-row">
                <div className="grow">
                    <h1 className="mb-8 text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-yellow-300 dark:to-yellow-300">
                            Tus mazos
                        </span>
                    </h1>
                </div>
                <div className="h-full">
                    <CrearMazoButton />
                </div>
            </div>
            <MazoSearch mazos={mazos} linkEdit={true} />
        </>
    );
}