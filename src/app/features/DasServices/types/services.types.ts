export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  providerName: string;
  priceType: "FIXED" | "HOURLY" | "NEGOTIABLE";
  priceAmount?: number | null;
  province: string;
  district: string;
  location: string;
  images: string[];
  category: { name: string };
  contactPhone: string;
  whatsappNumber?: string | null;
  isPublished?: boolean;
  viewsCount?: number;
  userId?: string | null;
  experienceYears?: number | null;
  availability?: string | null;
  serviceOffered: string;
  averageRating: number;
  areasServiced?: string | null;
  updatedAt: Date
}