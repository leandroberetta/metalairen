-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('jugador', 'juez', 'admin');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "rol" "Rol" NOT NULL DEFAULT 'jugador';
