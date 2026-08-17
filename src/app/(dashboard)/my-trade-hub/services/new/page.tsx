import { createService } from "@/app/features/DasServices/actions/services.action";
import { ServicesForm } from "@/app/features/DasServices/components/ServicesForm";

export default function CreateService() {
  return (
    <div className="">
      <ServicesForm onSubmitAction={createService} />
    </div>
  )
}