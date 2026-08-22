import { getServices } from "@/app/features/services/actions/service.action";
import { ServicesPublicView } from "@/app/features/services/components/ServicePublicView";
import { prisma } from "@/lib/prisma";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    province?: string;
    district?: string;
    sort?: string;
  }>;
}

export default async function PublicServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const serviceCategories = await prisma.serviceCategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" }
  });

  const locationQuery = params.district || params.province || "";

  const response = await getServices({
    query: params.q,
    category: params.category,
    location: locationQuery,
    sort: params.sort,
  });

  const services = response.success ? response.services : [];

  return (
    <ServicesPublicView
      initialServices={services as any}
      categories={serviceCategories}
    />
  );
}