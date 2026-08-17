export interface ServiceCategoryOption {
  id: string;
  name: string;
  slug: string;
}

export const ServiceCategories: ServiceCategoryOption[] = [
  { id: "cat-1", name: "Plumbing", slug: "plumbing" },
  { id: "cat-2", name: "Electrical", slug: "electrical" },
  { id: "cat-3", name: "Cleaning & Housekeeping", slug: "cleaning-housekeeping" },
  { id: "cat-4", name: "Appliance Repair", slug: "appliance-repair" },
  { id: "cat-5", name: "Painting & Renovation", slug: "painting-renovation" },
  { id: "cat-6", name: "IT & Tech Support", slug: "it-tech-support" },
  { id: "cat-7", name: "Tutoring & Lessons", slug: "tutoring-lessons" },
];