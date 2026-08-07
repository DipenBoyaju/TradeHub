"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useRef, useTransition } from "react";
import { FieldError, useForm } from "react-hook-form";
import { ServicesInput, servicesSchema } from "../schemas/services.schema";
import Image from "next/image";
import { Image as CamerImage } from "lucide-react";
import { useRouter } from "next/navigation";

const ServiceCategories = [
  { id: "cat-1", name: "Plumbing" },
  { id: "cat-2", name: "Electrical" },
  { id: "cat-3", name: "Cleaning & Housekeeping" },
  { id: "cat-4", name: "Appliance Repair" },
  { id: "cat-5", name: "Painting & Renovation" },
  { id: "cat-6", name: "IT & Tech Support" },
  { id: "cat-7", name: "Tutoring & Lessons" },
];

interface ServiceFormProps {
  initialData?: ServicesInput & { id?: string };
  onSubmitAction: (data: ServicesInput) => Promise<{ error?: string; success: boolean; serviceId?: string }>;
}

export function ServicesForm({ initialData, onSubmitAction }: ServiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ServicesInput>({
    resolver: zodResolver(servicesSchema),
    defaultValues: {
      title: initialData?.title || "",
      providerName: initialData?.providerName || "",
      categoryId: initialData?.categoryId || "",
      priceType: initialData?.priceType || "FIXED",
      priceAmount: initialData?.priceAmount || undefined,
      location: initialData?.location || "",
      areasServiced: initialData?.areasServiced || "",
      experienceYears: initialData?.experienceYears || undefined,
      availability: initialData?.availability || "",
      serviceOffered: initialData?.serviceOffered || "",
      contactPhone: initialData?.contactPhone || "",
      whatsappNumber: initialData?.whatsappNumber || "",
      images: initialData?.images || [],
    },
  });

  const priceType = watch("priceType");
  const images = watch("images");

  const onSubmit = (data: ServicesInput) => {
    startTransition(async () => {
      const res = await onSubmitAction(data);
      if (res?.error) {
        alert(res.error);
      }
      if (res?.success) {
        router.push("/services");
        router.refresh();
      }
    })
  };

  const compressAndReadImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200; // Resize large photos to max 1200px width
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

        // Clean up object URL to prevent memory leaks
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
      // 1. Actually call compressAndReadImage for each file using Promise.all
      const compressedBase64Array = await Promise.all(
        selectedFiles.map((file) => compressAndReadImage(file))
      );

      // 2. Read latest values and update form state once
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

  const inputClass = (error?: FieldError | boolean) =>
    `
      w-full h-12 rounded-xl border bg-white px-4
      text-[15px] text-slate-800
      placeholder:text-slate-400
      outline-none
      transition-all duration-200
      ${error
      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
      : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
    }
    `;

  const textareaClass = (error?: FieldError | boolean) =>
    `
      w-full rounded-xl border bg-white px-4 py-3
      text-[15px] leading-6 text-slate-800
      placeholder:text-slate-400
      outline-none
      resize-none
      transition-all duration-200
      ${error
      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
      : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
    }
    `;

  const FieldLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-slate-700">
      {children}
      {required && <span className="ml-1 text-indigo-500">*</span>}
    </label>
  );

  const ErrorMessage = ({ error }: { error?: FieldError }) => {
    if (!error) return null;

    return (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {error.message}
      </p>
    );
  };

  const SectionHeader = ({ number, title, description }: { number: string; title: string; description: string }) => (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
        {number}
      </div>

      <div>
        <h2 className="text-[17px] font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          {initialData?.id
            ? "Edit Service Listing"
            : "Create New Service Listing"}
        </h1>

        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">
          Add the details below to showcase your professional services and
          help customers find you easily.
        </p>
      </div>

      <div className="pb-6 sm:pb-8">
        <section className="">
          <SectionHeader
            number="1"
            title="Basic Information"
            description="Tell customers what your service is about."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <FieldLabel required>Service Title</FieldLabel>

              <input
                {...register("title")}
                type="text"
                placeholder="e.g. Professional Plumbing & Pipe Repairs"
                className={inputClass(errors.title)}
              />

              <ErrorMessage error={errors.title} />
            </div>

            <div>
              <FieldLabel required>
                Provider / Business Name
              </FieldLabel>

              <input
                {...register("providerName")}
                type="text"
                placeholder="e.g. Kathmandu Home Care Services"
                className={inputClass(errors.providerName)}
              />

              <ErrorMessage error={errors.providerName} />
            </div>
          </div>

          <div className="mt-5">
            <FieldLabel required>Category</FieldLabel>

            <select
              {...register("categoryId")}
              className={inputClass(errors.categoryId)}
            >
              <option value="">Select a category</option>

              {ServiceCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <ErrorMessage error={errors.categoryId} />
          </div>
        </section>

        <div className="border-t border-slate-100" />

        <section className="py-6 sm:py-8">
          <SectionHeader
            number="2"
            title="Service Details"
            description="Describe what you offer and what customers can expect."
          />

          <div>
            <FieldLabel required>Description</FieldLabel>

            <textarea
              {...register("description")}
              rows={5}
              placeholder="Give customers a detailed overview of your service, experience, guarantees, and what makes your work different..."
              className={textareaClass(errors.description)}
            />

            <ErrorMessage error={errors.description} />
          </div>

          <div className="mt-5">
            <FieldLabel required>
              Services Offered Summary
            </FieldLabel>

            <textarea
              {...register("serviceOffered")}
              rows={3}
              placeholder="e.g. Leak fixing, pipe installation, water tank cleaning, bathroom fittings..."
              className={textareaClass(errors.serviceOffered)}
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Keep this short and specific. Separate multiple services with
              commas.
            </p>

            <ErrorMessage error={errors.serviceOffered} />
          </div>
        </section>

        <div className="border-t border-slate-100" />

        <section className="py-6 sm:py-8">
          <SectionHeader
            number="3"
            title="Pricing & Experience"
            description="Help customers understand your pricing and experience."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <FieldLabel required>Pricing Structure</FieldLabel>

              <select
                {...register("priceType")}
                className={inputClass(false)}
              >
                <option value="FIXED">Fixed Price</option>
                <option value="HOURLY">Hourly Rate</option>
                <option value="NEGOTIABLE">Negotiable</option>
              </select>
            </div>

            {priceType !== "NEGOTIABLE" && (
              <div>
                <FieldLabel required>
                  Price Amount (NPR)
                </FieldLabel>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                    NPR
                  </span>

                  <input
                    {...register("priceAmount", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="1,200"
                    className={`${inputClass(
                      errors.priceAmount
                    )} pl-14`}
                  />
                </div>

                <ErrorMessage error={errors.priceAmount} />
              </div>
            )}

            <div>
              <FieldLabel>Years of Experience</FieldLabel>

              <div className="relative">
                <input
                  {...register("experienceYears", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="5"
                  className={`${inputClass(
                    errors.experienceYears
                  )} pr-16`}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  years
                </span>
              </div>

              <ErrorMessage error={errors.experienceYears} />
            </div>
          </div>
        </section>

        <div className="border-t border-slate-100" />

        <section className="py-6 sm:py-8">
          <SectionHeader
            number="4"
            title="Location & Contact"
            description="Let customers know where and when they can reach you."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <FieldLabel required>Location / City</FieldLabel>

              <input
                {...register("location")}
                type="text"
                placeholder="e.g. Kathmandu"
                className={inputClass(errors.location)}
              />

              <ErrorMessage error={errors.location} />
            </div>

            <div>
              <FieldLabel>Areas Serviced</FieldLabel>

              <input
                {...register("areasServiced")}
                type="text"
                placeholder="e.g. Baneshwor, Koteshwor, Chabahil"
                className={inputClass(false)}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <FieldLabel required>Contact Phone</FieldLabel>

              <input
                {...register("contactPhone")}
                type="text"
                placeholder="9801234567"
                className={inputClass(errors.contactPhone)}
              />

              <ErrorMessage error={errors.contactPhone} />
            </div>

            <div>
              <FieldLabel>WhatsApp Number</FieldLabel>

              <input
                {...register("whatsappNumber")}
                type="text"
                placeholder="9801234567"
                className={inputClass(false)}
              />
            </div>

            <div>
              <FieldLabel>Availability</FieldLabel>

              <input
                {...register("availability")}
                type="text"
                placeholder="Sun - Fri, 8 AM - 6 PM"
                className={inputClass(false)}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-slate-100" />

        <section className="py-6 sm:py-8">
          <SectionHeader
            number="5"
            title="Work Photos & Portfolio"
            description="Show customers examples of your previous work."
          />

          <input type="file" accept="images/*" multiple ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

          <div
            className="cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center">
              <CamerImage size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              Upload your work photos
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Add up to 6 photos showing your previous projects ({images.length}/6 uploaded)
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
            >
              Choose Photos
            </button>
          </div>

          {images.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm"
                >
                  <Image
                    src={imgUrl}
                    alt={`Uploaded preview ${idx + 1}`}
                    fill
                    sizes="(max-width:640px) 50vw, 16vw"
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-red-600 focus:outline-none"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <ErrorMessage error={errors.images as unknown as FieldError} />
        </section>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs text-slate-400">
            Fields marked with <span className="text-indigo-500">*</span> are
            required.
          </p>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}

            {initialData?.id
              ? "Update Listing"
              : "Publish Service Listing"}
          </button>
        </div>
      </div>
    </form>
  );
}