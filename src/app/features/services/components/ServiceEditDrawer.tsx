"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ServiceItem } from "../types/services.types";
import { ServicesInput } from "../schemas/services.schema";
import { ServiceCategories } from "./ServicesForm"

interface ServiceEditDrawerProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedService: Partial<ServiceItem>) => Promise<void> | void;
  categories: ServiceCategories[];
}


export function ServiceEditDrawer({
  service,
  isOpen,
  onClose,
  onSave,
  categories,
}: ServiceEditDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ServicesInput>();

  const selectedPriceType = watch("priceType");

  // Sync form data whenever service changes or drawer opens
  useEffect(() => {
    if (service && isOpen) {
      reset({
        title: service.title || "",
        providerName: service.providerName || "",
        categoryId: service.categoryId || "",
        priceType: service.priceType || "FIXED",
        priceAmount: service.priceAmount,
        location: service.location || "",
        areasServiced: service.areasServiced || "",
        availability: service.availability || "",
        contactPhone: service.contactPhone || "",
        whatsappNumber: service.whatsappNumber || "",
        experienceYears: service.experienceYears,
        serviceOffered: service.serviceOffered || "",
        description: service.description || "",
      });
    }
  }, [service, isOpen, reset]);

  if (!isOpen || !service) return null;

  const onSubmit = async (data: ServicesInput) => {
    // Find matching category object to keep category.name in sync on the UI
    const selectedCat = categories.find((c) => c.id === data.categoryId);

    const payload: Partial<ServiceItem> = {
      ...data,
      category: {
        name: selectedCat ? selectedCat.name : service.category?.name || "",
      },
      // Clear amount if pricing type is set to NEGOTIABLE
      priceAmount: data.priceType === "NEGOTIABLE" ? undefined : Number(data.priceAmount),
    };

    await onSave(payload);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md transform bg-white shadow-2xl transition-transform animate-in slide-in-from-right duration-200 flex flex-col h-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
            <div>
              <h2 className="text-base font-bold text-slate-800">Edit Service</h2>
              <p className="text-[11px] text-slate-500">ID: {service.id}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col justify-between overflow-hidden">
            <div className="space-y-4 overflow-y-auto p-6 flex-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Service Title</label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                />
                {errors.title && <p className="text-[10px] text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              {/* Provider Name & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Provider Name</label>
                  <input
                    type="text"
                    {...register("providerName", { required: "Provider name required" })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Category</label>
                  <select
                    {...register("categoryId", { required: "Category required" })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden bg-white"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Type & Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Price Type</label>
                  <select
                    {...register("priceType")}
                    onChange={(e) => {
                      const val = e.target.value as ServiceItem["priceType"];
                      setValue("priceType", val);
                      if (val === "NEGOTIABLE") setValue("priceAmount", undefined);
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden bg-white"
                  >
                    <option value="FIXED">Fixed Price</option>
                    <option value="HOURLY">Hourly Rate</option>
                    <option value="NEGOTIABLE">Negotiable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Amount (NPR)</label>
                  <input
                    type="number"
                    disabled={selectedPriceType === "NEGOTIABLE"}
                    {...register("priceAmount", { valueAsNumber: true })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Location & Areas Serviced */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Location</label>
                  <input
                    type="text"
                    {...register("location", { required: "Location required" })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Areas Serviced</label>
                  <input
                    type="text"
                    {...register("areasServiced")}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Contact Phone & WhatsApp */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Contact Phone</label>
                  <input
                    type="text"
                    {...register("contactPhone", { required: "Phone required" })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">WhatsApp Number</label>
                  <input
                    type="text"
                    {...register("whatsappNumber")}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={4}
                  {...register("description", { required: "Description required" })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-6 shrink-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}