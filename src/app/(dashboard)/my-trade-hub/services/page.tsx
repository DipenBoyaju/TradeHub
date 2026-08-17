import { getUserServices } from "@/app/features/DasServices/actions/services.action";
import { ServicesClientView } from "@/app/features/DasServices/components/ServiceClientView";
import { redirect } from "next/navigation";

export default async function DasServicePage() {
  const { data: services, error } = await getUserServices();

  if (error === "Unauthorized") {
    redirect("/login");
  }

  return (
    <div>
      <ServicesClientView services={services || []} />
    </div>
  )
}