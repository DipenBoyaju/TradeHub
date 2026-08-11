"use server";

import { uploadToCloudinary } from "@/lib/cloudinary";
import { ServicesInput, servicesSchema } from "../schemas/services.schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/auth-utils";

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
  const validated = servicesSchema.safeParse(rawData);
  const user = await getAuthUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to post a service listing."
    }
  }

  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Invalid form submission.";
    return { success: false, error: errorMessage };
  }

  const data = validated.data;

  try {
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
        location: data.location,
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
        userId: user.id,
      }
    });

    revalidatePath("/my-trade-hub/services");

    return { success: true, serviceId: newService.id }
  } catch (error) {
    console.error("Error creating service listing:", error);
    return { success: false, error: "Failed to create service listing. Please try again." }
  }
}