"use server";

import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type WatchlistEntityType = "SERVICE" | "PROPERTY";

export async function toggleWatchlistItem(
  entityId: string,
  type: WatchlistEntityType,
  path?: string
) {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const whereClause =
      type === "SERVICE"
        ? { userId_serviceId: { userId: user.id, serviceId: entityId } }
        : { userId_propertyId: { userId: user.id, propertyId: entityId } };

    const existing = await prisma.watchlistItem.findUnique({
      where: whereClause as any,
    });

    if (existing) {
      await prisma.watchlistItem.delete({ where: { id: existing.id } });
      if (path) revalidatePath(path);
      return { success: true, isBookmarked: false };
    }

    await prisma.watchlistItem.create({
      data: {
        userId: user.id,
        type,
        ...(type === "SERVICE" ? { serviceId: entityId } : { propertyId: entityId }),
      },
    });

    if (path) revalidatePath(path);
    revalidatePath("/watchlist")
    return { success: true, isBookmarked: true };
  } catch (error) {
    console.error("Watchlist toggle error:", error);
    return { success: false, error: "Failed to update watchlist" };
  }
}

export async function getWatchlistItem(type?: WatchlistEntityType) {
  const user = await getAuthUser();
  if (!user) return []

  const items = await prisma.watchlistItem.findMany({
    where: {
      userId: user.id,
      ...(type ? { type } : {})
    },
    include: {
      service: {
        include: { category: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })
  return items;
}