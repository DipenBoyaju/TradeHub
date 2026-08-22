"use server";

import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { ServicesInput, servicesSchema } from "../schemas/services.schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/auth-utils";
import { slugify } from "../../../../helper/slugify";
import z from "zod";

export type ActionResponse = {
  success: boolean;
  error?: string;
  serviceId?: string;
}

const categoryMap: Record<string, string> = {
  "cat-1": "Plumbing",
  "cat-2": "Electrical",
  "cat-3": "Cleaning & Housekeeping",
  "cat-4": "Appliance Repair",
  "cat-5": "Painting & Renovation",
  "cat-6": "IT & Tech Support",
  "cat-7": "Tutoring & Lessons",
};

export async function createService(rawData: ServicesInput): Promise<ActionResponse> {
  const user = await getAuthUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to post a service listing."
    }
  }

  const validated = servicesSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Invalid form submission.";
    return { success: false, error: errorMessage };
  }

  const data = validated.data;


  try {
    const baseSlug = slugify(data.title);
    let uniqueSlug = baseSlug;

    const existingSlug = await prisma.service.findUnique({
      where: { slug: uniqueSlug }
    });

    if (existingSlug) {
      uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const uploadedImages = await Promise.all(
      (data.images || []).map((img) => uploadToCloudinary(img, "services"))
    );

    const categoryName = categoryMap[data.categoryId] || "General Service";
    const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newService = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        providerName: data.providerName,
        priceType: data.priceType,
        priceAmount: data.priceType === "NEGOTIABLE" ? null : data.priceAmount,
        province: data.province,
        district: data.district,
        location: data.location,
        slug: uniqueSlug,
        areasServiced: data.areasServiced || null,
        experienceYears: data.experienceYears ?? null,
        availability: data.availability || null,
        serviceOffered: data.serviceOffered,
        contactPhone: data.contactPhone,
        whatsappNumber: data.whatsappNumber || null,
        images: uploadedImages,
        category: {
          connectOrCreate: {
            where: { id: data.categoryId },
            create: {
              id: data.categoryId,
              name: categoryName,
              slug: categorySlug,
            },
          },
        },

        isPublished: data.isPublished ?? true,
        viewsCount: data.viewsCount ?? 0,
        user: {
          connect: { id: user.id },
        },
      }
    });

    revalidatePath("/my-trade-hub/services");
    revalidatePath("/services");

    return { success: true, serviceId: newService.id }
  } catch (error) {
    console.error("Error creating service listing:", error);
    return { success: false, error: "Failed to create service listing. Please try again." }
  }
}

export async function updateService(serviceId: string, rawData: ServicesInput): Promise<ActionResponse> {
  const user = await getAuthUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in"
    }
  }

  const validated = servicesSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Invalid form submission";
    return { success: false, error: errorMessage };
  }

  const data = validated.data;

  try {
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true, userId: true, title: true, slug: true, images: true }
    });

    if (!existingService) {
      return {
        success: false,
        error: "Service listing not found."
      }
    }

    if (existingService.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }
    let slug = existingService.slug;
    if (existingService?.title !== data.title) {
      const baseSlug = slugify(data.title);

      const existingSlugCount = await prisma.service.count({
        where: {
          slug: baseSlug,
          NOT: { id: serviceId }
        }
      });

      slug = existingSlugCount > 0 ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;
    }

    const updatedImages = await Promise.all(
      (data.images || []).map((img) => uploadToCloudinary(img, "services"))
    );

    const removedImages = (existingService.images || []).filter(
      (oldUrl) => !updatedImages.includes(oldUrl)
    );

    if (removedImages.length > 0) {
      await Promise.all(
        removedImages.map((imgUrl) => deleteFromCloudinary(imgUrl))
      );
    }

    const categoryName = categoryMap[data.categoryId] || "General Service";
    const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        title: data.title,
        slug: slug,
        description: data.description,
        providerName: data.providerName,
        priceType: data.priceType,
        priceAmount: data.priceType === "NEGOTIABLE" ? null : data.priceAmount,
        province: data.province,
        district: data.district,
        location: data.location,
        areasServiced: data.areasServiced || null,
        experienceYears: data.experienceYears ?? null,
        availability: data.availability || null,
        serviceOffered: data.serviceOffered,
        contactPhone: data.contactPhone,
        whatsappNumber: data.whatsappNumber || null,
        images: updatedImages,
        category: {
          connectOrCreate: {
            where: { id: data.categoryId },
            create: {
              id: data.categoryId,
              name: categoryName,
              slug: categorySlug,
            },
          },
        },
        isPublished: data.isPublished ?? true,
      }
    });

    revalidatePath("/my-trade-hub/services");
    revalidatePath("/services");

    return { success: true, serviceId: updatedService.id }

  } catch (error) {
    console.error("Error updating service listing:", error);
    return {
      success: false,
      error: "Failed to update service listing. Please try again.",
    }
  }
}

export async function deleteService(serviceId: string): Promise<ActionResponse> {
  const user = await getAuthUser();

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true, userId: true, images: true },
    });

    if (!existingService) {
      return { success: false, error: "Service listing not found." };
    }

    if (existingService.userId !== user.id) {
      return { success: false, error: "Unauthorized" }
    }
    if (existingService.images && existingService.images.length > 0) {
      existingService.images.map((imgUrl) => deleteFromCloudinary(imgUrl))
    }

    await prisma.service.delete({
      where: { id: serviceId }
    })

    revalidatePath("/my-trade-hub/services")
    revalidatePath("/services")

    return { success: true };
  } catch (error) {
    console.error("Error deleting service listing:", error);
    return {
      success: false,
      error: "Failed to delete service listing. Please try again.",
    };
  }
}

const statusUpdateSchema = z.object({
  isPublished: z.boolean(),
});

export async function updatePublishStatus(serviceId: string, data: any) {
  const user = await getAuthUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { isPublished } = statusUpdateSchema.parse(data);

    const updatedService = await prisma.service.update({
      where: {
        id: serviceId,
        userId: user.id,
      },
      data: {
        isPublished,
      },
    });

    revalidatePath("/my-trade-hub/services");
    revalidatePath("/services", "page");

    return { success: true, service: updatedService };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    console.error("Error updating service status:", error);
    return {
      success: false,
      error: "Failed to update service status. Please try again.",
    };
  }
}

export async function getUserServices() {
  const user = await getAuthUser();

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const services = await prisma.service.findMany({
      where: { userId: user.id },
      include: {
        category: {
          select: {
            name: true,
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    return { success: true, data: services };
  } catch (error) {
    console.error("Error fetching user services:", error);
    return { success: false, data: [], error: "Failed to load services." };
  }
}