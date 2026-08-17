"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ServiceItem } from "@/app/features/services/types/services.types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Tag,
  MapPin,
  Phone,
  MessageCircle,
  UserRound,
} from "lucide-react";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (serviceId: string) => void;
  onDelete?: (serviceId: string) => void;
  onTogglePublish?: (serviceId: string, currentStatus: boolean) => void;
}

export function ServiceDetailModal({
  service,
  isOpen,
  onClose,
}: ServiceDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, service]);

  if (!isOpen || !service) return null;

  const images =
    service.images && service.images.length > 0
      ? service.images
      : ["/placeholder-service.jpg"];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formattedPrice =
    service.priceType === "NEGOTIABLE"
      ? "Negotiable"
      : service.priceAmount
        ? `NPR ${service.priceAmount.toLocaleString()} ${service.priceType === "HOURLY" ? "/ hr" : ""
        }`
        : "Not set";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Listing Overview
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
            title="Close Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto">
          {/* --- SLIDABLE IMAGE GALLERY --- */}
          <div className="relative aspect-21/9 w-full bg-slate-950">
            <Image
              src={images[activeImageIndex]}
              alt={`${service.title} preview ${activeImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/50 p-2 text-white hover:bg-slate-900/80"
                  title="Previous Image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/50 p-2 text-white hover:bg-slate-900/80"
                  title="Next Image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-slate-900/40 px-3 py-1.5 backdrop-blur-md">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${activeImageIndex === idx
                        ? "w-6 bg-white"
                        : "w-2.5 bg-white/50 hover:bg-white/80"
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* --- OWNER MANAGEMENT STATS & DATA --- */}
          <div className="p-6 space-y-6">
            {/* Header: Category & Title */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-hover">
                    <Tag className="h-3.5 w-3.5" />
                    {service.category.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-primary" />
                    <p className="capitalize text-sm font-semibold text-primary-hover">{service.location}</p>
                  </div>
                </div>

                <span className="text-xl font-bold text-slate-900">
                  {formattedPrice}
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 font-heading">
                {service.title}
              </h2>
              <div className="flex items-center gap-2 pt-3">
                <UserRound size={18} className="bg-primary p-0.5 rounded-full text-white" />
                <h3 className="text-slate-500 text-sm underline">{service.providerName}</h3>
              </div>
            </div>

            {/* Performance Analytics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Eye className="h-4 w-4 text-purple-500" />
                  Total Views
                </span>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {service.viewsCount || 0}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Target Area
                </span>
                <p className="mt-1 text-sm font-semibold text-slate-800 line-clamp-1 capitalize">
                  {service.areasServiced}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  Availability
                </span>
                <p className="mt-1 text-sm font-semibold text-slate-800 line-clamp-1">
                  {service.availability || "Flexible"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {service.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Services Offered
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {service.serviceOffered}
              </p>
            </div>

            {/* Contact Details Registered for Listing */}
            <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/30">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Configured Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>Phone: <strong className="text-slate-800">{service.contactPhone}</strong></span>
                </div>
                {service.whatsappNumber && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-emerald-500" />
                    <span>WhatsApp: <strong className="text-slate-800">{service.whatsappNumber}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}