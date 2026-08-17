export interface ServiceCategory {
  id: string;
  name: string;
  slug?: string;
}

export interface PublicServiceItem {
  id: string;
  title: string;
  description: string;
  providerName: string;
  slug: string;
  category: ServiceCategory;
  priceType: "FIXED" | "HOURLY" | "NEGOTIABLE";
  priceAmount?: number | null;
  location: string;
  images: string[];
  viewsCount: number;
  averageRating: number;
  totalReviews: number;
  isPublished: boolean;
  createdAt: string | Date;
}