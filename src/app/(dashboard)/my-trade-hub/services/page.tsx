import { getUserServices } from "@/app/features/services/actions/services.action";
import { ServicesClientView } from "@/app/features/services/components/ServiceClientView";
import { redirect } from "next/navigation";

export default async function DasServicePage() {
  const { data: services, error } = await getUserServices();

  if (error === "Unauthorized") {
    redirect("/login");
  }

  return (
    <div>
      <ServicesClientView initialServices={services || []} />
    </div>
  )
}