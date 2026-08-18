import z from "zod";

export const EntityTypeEnum = z.enum(["SERVICE", "PRODUCT", "PROPERTY"]);
export type EntityType = z.infer<typeof EntityTypeEnum>;

export const reviewSchema = z.object({
  entityId: z
    .string()
    .min(1, "Target ID is required"),
  entityType: EntityTypeEnum,
  userName: z
    .string()
    .default("Anonymous User"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .min(4, "Comment must be at least 4 characters long"),
  images: z
    .array(z.string())
    .max(3, "Only 3 images can be uploaded")
    .optional().default([]),

})

export type ReviewInput = z.infer<typeof reviewSchema>;