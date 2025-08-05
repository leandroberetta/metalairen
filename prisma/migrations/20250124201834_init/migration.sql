-- CreateTable
CREATE TABLE "cartas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "subtipo1" TEXT,
    "subtipo2" TEXT,
    "subtipo3" TEXT,
    "subtipo4" TEXT,
    "supertipo" TEXT,
    "rareza" TEXT NOT NULL,
    "coste" INTEGER NOT NULL,
    "expansion" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "costeBoveda" INTEGER,
    "prohibida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "idLairen" INTEGER NOT NULL,

    CONSTRAINT "cartas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mazos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtipo1" TEXT,
    "subtipo2" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "publico" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mazos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mazos_cartas" (
    "id" SERIAL NOT NULL,
    "mazoId" INTEGER NOT NULL,
    "cartaId" INTEGER NOT NULL,
    "seccion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mazos_cartas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "torneos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provincia" TEXT NOT NULL,
    "sede" TEXT NOT NULL,

    CONSTRAINT "torneos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "torneos_mazos" (
    "id" SERIAL NOT NULL,
    "torneoId" INTEGER NOT NULL,
    "mazoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participante" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,

    CONSTRAINT "torneos_mazos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cartas_idLairen_key" ON "cartas"("idLairen");

-- AddForeignKey
ALTER TABLE "mazos" ADD CONSTRAINT "mazos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mazos_cartas" ADD CONSTRAINT "mazos_cartas_mazoId_fkey" FOREIGN KEY ("mazoId") REFERENCES "mazos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mazos_cartas" ADD CONSTRAINT "mazos_cartas_cartaId_fkey" FOREIGN KEY ("cartaId") REFERENCES "cartas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "torneos_mazos" ADD CONSTRAINT "torneos_mazos_torneoId_fkey" FOREIGN KEY ("torneoId") REFERENCES "torneos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "torneos_mazos" ADD CONSTRAINT "torneos_mazos_mazoId_fkey" FOREIGN KEY ("mazoId") REFERENCES "mazos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
