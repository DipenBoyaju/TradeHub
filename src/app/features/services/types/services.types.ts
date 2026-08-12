export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  providerName: string;
  priceType: "FIXED" | "HOURLY" | "NEGOTIABLE";
  priceAmount?: number | null;
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
  areasServiced?: string | null;
}