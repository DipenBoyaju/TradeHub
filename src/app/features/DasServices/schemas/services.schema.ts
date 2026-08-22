import { z } from "zod";

export const priceTypeEnum = z.enum(["FIXED", "HOURLY", "NEGOTIABLE"]);

export const servicesSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long.")
    .max(100, "Title cannot exceed 100 characters."),
  description: z
    .string()
    .min(20, `Please provide a detailed description of the service (at least 20 characters)`)
    .max(800, "Description cannot exceed 800 characters."),
  providerName: z
    .string()
    .min(2, "Provider or business name is required")
    .max(100, "Provider name is too long"),
  categoryId: z
    .string()
    .min(1, "Please select a valid service category"),
  priceType: priceTypeEnum,
  priceAmount: z
    .number({ message: "Price must be a valid number" })
    .positive("Price must be greater than 0")
    .optional()
    .nullable(),
  province: z
    .string(),
  district: z.string(),
  location: z
    .string()
    .min(2, "City/Region is required (e.g. Kathmandu, Bhaktapur, Lalitpur)")
    .max(100, "City/Region name is too long"),
  areasServiced: z
    .string()
    .max(100, "Serviced area is too long")
    .optional(),
  experienceYears: z
    .number({ message: "Years of experience must be a number" })
    .min(0, "Experience cannot be negative")
    .max(60, "Please enter a realistic number of years")
    .optional()
    .nullable(),
  availability: z
    .string()
    .max(80, "Availability description is too long")
    .optional(),
  serviceOffered: z
    .string()
    .min(20, "Please provide services provided (at least 20 characters)")
    .max(100, "Service description is too long"),
  contactPhone: z
    .string()
    .min(10, "Valid phone number is required")
    .max(15, "Phone number is too long"),
  whatsappNumber: z
    .string()
    .max(15, "WhatsApp number is too long")
    .optional(),
  images: z
    .array(z.string())
    .min(1, "Please upload at least one image or logo")
    .max(6, "You can upload a maximum of 6 images"),
  isPublished: z.boolean().optional().default(true),
  viewsCount: z.number().optional().default(0),
}).refine(
  (data) => {
    if (data.priceType !== "NEGOTIABLE") {
      return data.priceAmount !== undefined && data.priceAmount !== null && data.priceAmount > 0;
    }
    return true;
  },
  {
    message: "Please specify a valid price amount for Fixed or Hourly rates",
    path: ["priceAmount"],
  }
);

export type ServicesInput = z.infer<typeof servicesSchema>;