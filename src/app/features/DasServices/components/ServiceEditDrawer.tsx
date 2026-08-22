"use client";

import { useEffect, useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Image as CamerImage } from "lucide-react";
import Image from "next/image";
import { ServiceItem } from "../types/services.types";
import { ServicesInput } from "../schemas/services.schema";
import { NEPAL_LOCATIONS } from "@/lib/constants/locations";

export interface ServiceCategory {
  id: string;
  name: string;
}

interface ServiceEditDrawerProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedService: Partial<ServiceItem>) => Promise<void> | void;
  categories: ServiceCategory[];
}

export function ServiceEditDrawer({
  service,
  isOpen,
  onClose,
  onSave,
  categories,
}: ServiceEditDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<ServicesInput>();

  const selectedPriceType = watch("priceType");
  const isPublished = watch("isPublished");
  const images = watch("images") || [];
  const selectedProvince = watch("province");

  const availableDistricts = selectedProvince
    ? NEPAL_LOCATIONS[selectedProvince as keyof typeof NEPAL_LOCATIONS] || []
    : [];

  useEffect(() => {
    if (service && isOpen) {
      const matchedCategory = categories.find((c) => c.name === service.category?.name);

      reset({
        title: service.title || "",
        providerName: service.providerName || "",
        categoryId: service.categoryId || matchedCategory?.id || "",
        priceType: service.priceType || "FIXED",
        priceAmount: service.priceAmount,
        province: service.province || "",
        district: service.district || "",
        location: service.location || "",
        areasServiced: service.areasServiced || "",
        availability: service.availability || "",
        contactPhone: service.contactPhone || "",
        whatsappNumber: service.whatsappNumber || "",
        experienceYears: service.experienceYears,
        serviceOffered: service.serviceOffered || "",
        description: service.description || "",
        isPublished: service.isPublished ?? true,
        images: service.images || [],
      });
    }
  }, [service, isOpen, reset, categories]);

  if (!isOpen || !service) return null;

  // --- Image Helpers ---
  const compressAndReadImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;

        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const base64 = canvas.toDataURL("image/jpeg", 0.7);
        URL.revokeObjectURL(objectUrl);
        resolve(base64);
      };
    });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files || files.length === 0) return;

    const currentImages = getValues("images") || [];
    const remainingSlots = 6 - currentImages.length;

    if (remainingSlots <= 0) {
      alert("Maximum 6 images allowed.");
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    try {
      const compressedBase64Array = await Promise.all(
        selectedFiles.map((file) => compressAndReadImage(file))
      );
      const latestImages = getValues("images") || [];
      setValue("images", [...latestImages, ...compressedBase64Array], {
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const onSubmit = async (data: ServicesInput) => {
    const selectedCat = categories.find((c) => c.id === data.categoryId);

    const payload: Partial<ServiceItem> = {
      ...data,
      images: data.images || [],
      category: {
        name: selectedCat ? selectedCat.name : service.category?.name || "",
      },
      priceAmount: data.priceType === "NEGOTIABLE" ? undefined : Number(data.priceAmount),
      experienceYears: data.experienceYears ? Number(data.experienceYears) : undefined,
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

              {/* Status Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                      }`}
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">
                      Listing Status: {isPublished ? "Published" : "Draft"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isPublished ? "Visible to public users" : "Hidden from marketplace"}
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    {...register("isPublished")}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-hidden"></div>
                </label>
              </div>

              {/* Service Photos Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Service Photos ({images.length}/6)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-center transition hover:border-amber-500 hover:bg-amber-50/30"
                >
                  <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center text-slate-500">
                    <CamerImage size={24} strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Upload or replace photos
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Click here to add up to {6 - images.length} more photos
                  </p>
                </div>

                {/* Images Preview Grid */}
                {images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Service preview ${idx + 1}`}
                          fill
                          sizes="100px"
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/80 text-[10px] text-white transition hover:bg-red-600 cursor-pointer"
                          title="Remove photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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

              {/* Experience & Availability */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Experience (Years)</label>
                  <input
                    type="number"
                    {...register("experienceYears", { valueAsNumber: true })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Availability</label>
                  <input
                    type="text"
                    placeholder="e.g. Sun - Fri, 9AM - 5PM"
                    {...register("availability")}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Province</label>
                  <select
                    {...register("province", { required: "Province required" })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden bg-white"
                  >
                    <option value="" disabled>Select Province</option>
                    {Object.keys(NEPAL_LOCATIONS).map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">District</label>
                  <select
                    {...register("district", { required: "District required" })}
                    disabled={!selectedProvince}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden bg-white"
                  >
                    <option value="" disabled>{selectedProvince ? "Select a district" : "Select a province first"}</option>
                    {availableDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
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

              {/* Services Offered */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Services Offered</label>
                <input
                  type="text"
                  placeholder="e.g. Tile replacement, Bathroom fitting"
                  {...register("serviceOffered")}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
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