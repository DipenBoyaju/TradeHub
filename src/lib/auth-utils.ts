import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";


export async function getAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

export async function getUserDetails() {
  const user = await getAuthUser();

  if (!user) return null;

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  return {
    ...user,
    profile,
  }
}

export async function requiredAuthUser() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}