
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "./app/db/prisma";
import { Usuario } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      console.log("signIn", user);
      if (user.email && user.name) {
        console.log("ensureUserExists", user.email, user.name);
        await ensureUserExists(user.email, user.name);
      }

      return true;
    },
  },
})

async function ensureUserExists(email: string, name: string) {
  const user = await findUserByEmail(email);
  console.log("ensureUserExists", user);
  if (!user) {
    await createUser({ email, name });
  }
}

async function findUserByEmail(email: string): Promise<Usuario | null> {
  const usuario = await prisma.usuario.findFirst({
    where: { email },
  });
  return usuario || null;
}

async function createUser(user: { email: string, name: string }) {
  console.log("createUser", user);
  await prisma.usuario.create({
    data: {
      nombre: user.name,
      email: user.email,
    },
  });
}