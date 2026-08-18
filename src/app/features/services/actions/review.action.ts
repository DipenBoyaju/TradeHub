"use server";

import { getUserDetails } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { ReviewInput, reviewSchema } from "@/lib/validations/reviewSchema";
import { revalidatePath } from "next/cache";

export async function submitReview(rawData: ReviewInput) {
  const user = await getUserDetails();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to submit a review.",
    }
  }

  const resolvedUserName = user.name || user.email || "Anonymous User";

  const validated = reviewSchema.safeParse({
    ...rawData,
    userName: resolvedUserName,
  });

  if (!validated.success) {
    const issue = validated.error.issues[0];
    return {
      success: false,
      error: issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid review data",
    };
    // return {
    //   success: false,
    //   error: validated.error.issues[0]?.message || "Invalid input",
    // };
  }

  const { entityId, entityType, userName, rating, comment, images } = validated.data;

  try {
    let createdReview;

    switch (entityType) {
      case "SERVICE": {
        // Run create and aggregate/update operations inside a fast transaction
        [createdReview] = await prisma.$transaction(async (tx) => {
          const review = await tx.serviceReview.create({
            data: {
              serviceId: entityId,
              userName,
              rating,
              comment,
              images: (images ?? []) as string[],
            },
          });

          const agg = await tx.serviceReview.aggregate({
            where: { serviceId: entityId },
            _count: { _all: true },
            _avg: { rating: true },
          });

          await tx.service.update({
            where: { id: entityId },
            data: {
              totalReviews: agg._count._all,
              avarageRating: agg._avg.rating ?? 0,
            },
          });

          return [review];
        });

        // Revalidate without blocking response
        revalidatePath("/services");

        break;
      }

      // case "PRODUCT": {
      //   createdReview = await prisma.productReview.create({
      //     data: { productId: entityId, userName, rating, comment, images },
      //   });

      //   // Recalculate Product Ratings
      //   const agg = await prisma.productReview.aggregate({
      //     where: { productId: entityId },
      //     _count: { _all: true },
      //     _avg: { rating: true },
      //   });
      //   await prisma.product.update({
      //     where: { id: entityId },
      //     data: {
      //       totalReviews: agg._count._all,
      //       avarageRating: agg._avg.rating ?? 0,
      //     },
      //   });

      //   revalidatePath(`/products`);
      //   break;
      // }

      // case "PROPERTY": {
      //   createdReview = await prisma.propertyReview.create({
      //     data: { propertyId: entityId, userName, rating, comment, images },
      //   });

      //   // Recalculate Property Ratings
      //   const agg = await prisma.propertyReview.aggregate({
      //     where: { propertyId: entityId },
      //     _count: { _all: true },
      //     _avg: { rating: true },
      //   });
      //   await prisma.property.update({
      //     where: { id: entityId },
      //     data: {
      //       totalReviews: agg._count._all,
      //       avarageRating: agg._avg.rating ?? 0,
      //     },
      //   });

      //   revalidatePath(`/properties`);
      //   break;
      // }

      default:
        return { success: false, error: "Invalid entity type" };
    }

    return {
      success: true,
      review: createdReview,
    };
  } catch (error) {
    console.error("Error submitting review:", error);
    return {
      success: false,
      error: "Failed to submit review. Please try again.",
    };
  }
}