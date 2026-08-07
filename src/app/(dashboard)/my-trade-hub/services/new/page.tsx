import { createService } from "@/app/features/services/actions/services.action";
import { ServicesForm } from "@/app/features/services/components/ServicesForm";

export default function CreateService() {
  return (
    <div className="">
      <ServicesForm onSubmitAction={createService} />
    </div>
  )
}