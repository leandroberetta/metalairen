import LoadingSpinner from "@/app/components/LoadingSpinner";
import MazoError from "@/app/components/mazo/MazoError";
import MazoViewer from "@/app/components/mazo/MazoViewer";
import { prisma } from "@/app/db/prisma";
import { buildMazo } from "@/app/util/mazoUtil";
import { auth } from "@/auth";
import { Suspense } from "react";

export default async function MazoId({ params }: { params: Promise<{ id: string }> }) {
    const mazo = await prisma.mazo.findUnique({
        where: { id: parseInt((await params).id) },
        include: {
            cartas: true,
        },
    });

    if (!mazo) {
        return <MazoError />;
    }

    if (!mazo.publico) {
        const session = await auth();
        const email = session?.user?.email;
        if (!email) {
            return <MazoError />;
        }
        const usuario = await prisma.usuario.findFirst({ where: { email: email } });
        if (usuario && usuario.id !== mazo.usuarioId) {
            return <MazoError />;
        }
    }

    const mazoTmp = await buildMazo(mazo);

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <MazoViewer mazoGuardado={mazoTmp} nombreGuardado={mazo.nombre} subtipo1Guardado={mazo.subtipo1} subtipo2Guardado={mazo.subtipo2} />
        </Suspense>
    );
}

/*
export async function generateStaticParams() {
    const mazos = await prisma.mazo.findMany();

    return mazos.map((mazo) => ({
        id: mazo.id.toString(),
    }))
}
    */