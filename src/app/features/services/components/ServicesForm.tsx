"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form"
import { servicesSchema } from "../schemas/services.schema";

const ServiceCategories = [
  "Plumbing",
  "Electrical",
  "Home Cleaning",
  "Appliance Repair",
  "Painting & Renovation",
  "IT & Tech Support",
  "Tutoring & Lessons",
];

export function ServicesForm() {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(servicesSchema),
    defaultValues: {
      title: ""
    }
  })

  return (
    <form
      className="space-y-8"
    >
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Service Title
        </label>
        <input {...register("title")} type="text" placeholder="e.g. Professional Electrical Wiring & Fitting"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Provider Name
        </label>
        <input {...register("providerName")} type="text" placeholder="Provider or business name" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Category
        </label>
        <select {...register("category")} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
          <option value="">Select a category</option>
          {ServiceCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {/* {errors.category && (
          <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
        )} */}
      </div>
    </form >
  )
}