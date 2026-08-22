"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface GetServicesParmas {
  query?: string;
  category?: string;
  location?: string;
  sort?: string;
}

export async function getServices(params: GetServicesParmas = {}) {
  const { query, category, location, sort } = params;

  try {
    const where: Prisma.ServiceWhereInput = {
      isPublished: true,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } }
      ]
    };

    if (category && category !== "all") {
      where.category = {
        slug: {
          equals: category.toLowerCase(),
          mode: "insensitive"
        }
      }
    }

    if (location && location !== "all") {
      where.location = {
        equals: location,
        mode: "insensitive"
      }
    }

    let orderBy: Prisma.ServiceOrderByWithRelationInput = { createdAt: "desc" };

    if (sort === "top-rated") {
      orderBy = { averageRating: "desc" };
    } else if (sort === "most-viewed") {
      orderBy = { viewsCount: "desc" };
    } else if (sort === "alphabetical") {
      orderBy = { title: "asc" };
    } else if (sort === "price-low") {
      orderBy = { priceAmount: "asc" };
    } else if (sort === "price-high") {
      orderBy = { priceAmount: "desc" };
    }

    const services = await prisma.service.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (services.length === 0) {
      return {
        success: true,
        services: [],
        message: "No Services found"
      };
    }

    return {
      success: true,
      services
    }
  } catch (error) {
    console.error("Failed to fetch public services:", error);
    return {
      success: false,
      services: [],
      error: "Failed to load services. Please try again later."
    };
  }
}

export async function getServiceBySlug(slug: string) {

  try {
    const service = await prisma.service.findUnique({
      where: { slug: slug, isPublished: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        reviews: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    if (!service) {
      return { success: false, error: "Service not found" };
    }

    await prisma.service.update({
      where: { id: service.id },
      data: { viewsCount: { increment: 1 } }
    });

    return { success: true, service };
  } catch (error) {
    console.error("Error fetching service by slug:", error);
    return { success: false, error: "Failed to load service details." };
  }
}