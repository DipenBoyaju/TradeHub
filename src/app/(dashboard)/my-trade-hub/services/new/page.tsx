import { ServicesForm } from "@/app/features/services/components/ServicesForm";

export default function CreateService() {
  return (
    <div className="">
      <h1>Service Listing Form</h1>
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Service Listing
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Provide detailed information about your service to attract local customers.
        </p>
      </div>
      <ServicesForm />
    </div>
  )
}