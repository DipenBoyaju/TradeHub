"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form"
import { servicesSchema } from "../schemas/services.schema";
import { undefined } from "zod";

const ServiceCategories = [
  { id: "cat-1", name: "Plumbing" },
  { id: "cat-2", name: "Electrical" },
  { id: "cat-3", name: "Cleaning & Housekeeping" },
  { id: "cat-4", name: "Appliance Repair" },
  { id: "cat-5", name: "Painting & Renovation" },
  { id: "cat-6", name: "IT & Tech Support" },
  { id: "cat-7", name: "Tutoring & Lessons" },
];

export function ServicesForm({ initialData }) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(servicesSchema),
    defaultValues: {
      title: initialData?.title || "",
      providerName: initialData?.providerName || "",
      categoryId: initialData?.categoryId || "",
      priceType: initialData?.priceType || "FIXED",
      priceAmount: initialData?.priceAmount || "",
      location: initialData?.location || "",
      areasServiced: initialData?.areasServiced || "",
      experienceYears: initialData?.experienceYears || undefined,
      availability: initialData?.availability || "",
      serviceOffered: initialData?.serviceOffered || "",
      contactPhone: initialData?.contactPhone || "",
      whatsappNumber: initialData?.whatsappNumber || "",
      images: initialData?.images || [],
    }
  })

  const priceType = watch("priceType");
  const images = watch("images");

  const onSubmit = () => { }

  return (
    <form onSubmit={handleSubmit(onSubmit)}
      className="space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {initialData?.id ? "Edit Service Listing" : "Create New Service Listing"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill out the form below to showcase your professional services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Service Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            type="text"
            placeholder="e.g. Professional Plumbing & Pipe Repairs"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Provider / Business Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("providerName")}
            type="text"
            placeholder="e.g. Kathmandu Home Care Services"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.providerName && (
            <p className="text-xs text-red-500 mt-1">{errors.providerName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          {...register("categoryId")}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Select a category</option>
          {ServiceCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
        )}
      </div>
    </form >
  )
}