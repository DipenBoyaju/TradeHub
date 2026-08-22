"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ServiceItem } from "@/app/features/DasServices/types/services.types";
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
  Star,
  MessageSquareText,
} from "lucide-react";

interface ServiceDetailModalProps {
  service: (ServiceItem & { reviews?: any[] }) | null;
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

  const reviewsList = service.reviews || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container - Expanded width for split view */}
      <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Listing Overview
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Split Grid Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">

          <div className="lg:col-span-8 overflow-y-auto border-r border-slate-100">
            {/* Gallery */}
            <div className="relative aspect-21/9 w-full bg-slate-200">
              <Image
                src={images[activeImageIndex]}
                alt={`${service.title} preview ${activeImageIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
                className="object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/50 p-2 text-white hover:bg-slate-900/80 cursor-pointer"
                    title="Previous Image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/50 p-2 text-white hover:bg-slate-900/80 cursor-pointer"
                    title="Next Image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-slate-900/40 px-3 py-1.5 backdrop-blur-md">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${activeImageIndex === idx
                          ? "w-6 bg-white"
                          : "w-2.5 bg-white/50 hover:bg-white/80"
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-hover">
                      <Tag className="h-3.5 w-3.5" />
                      {service.category.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-primary" />
                      <p className="capitalize text-sm font-semibold text-primary-hover">
                        {service.location}
                      </p>
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
                  <UserRound
                    size={18}
                    className="bg-primary p-0.5 rounded-full text-white"
                  />
                  <h3 className="text-slate-500 text-sm underline">
                    {service.providerName}
                  </h3>
                </div>
              </div>

              {/* Performance Analytics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Eye className="h-4 w-4 text-purple-500" />
                    Total Views
                  </span>
                  <p className="mt-1 text-lg font-bold text-slate-800">
                    {service.viewsCount || 0}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Target Area
                  </span>
                  <p className="mt-1 text-xs font-semibold text-slate-800 line-clamp-1 capitalize">
                    {service.areasServiced}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    Availability
                  </span>
                  <p className="mt-1 text-xs font-semibold text-slate-800 line-clamp-1">
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

              {/* Contact Information */}
              <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/30">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Configured Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>
                      Phone:{" "}
                      <strong className="text-slate-800">
                        {service.contactPhone}
                      </strong>
                    </span>
                  </div>
                  {service.whatsappNumber && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-emerald-500" />
                      <span>
                        WhatsApp:{" "}
                        <strong className="text-slate-800">
                          {service.whatsappNumber}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50/40 flex flex-col h-full overflow-hidden">
            {/* Sidebar Sticky Header */}
            <div className="p-5 border-b border-slate-100 bg-white shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquareText className="h-4 w-4 text-slate-600" />
                  Client Reviews
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {reviewsList.length} Total
                </span>
              </div>

              {/* Rating Highlight Banner */}
              <div className="flex items-center gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-500 text-white shrink-0 font-bold text-lg">
                  {service.averageRating ? service.averageRating.toFixed(1) : "0.0"}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${star <= Math.round(service.averageRating || 0)
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-300"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Average Client Feedback
                  </p>
                </div>
              </div>
            </div>

            {/* Independently Scrollable Review Items */}
            <div className="p-5 overflow-y-auto flex-1 space-y-3">
              {reviewsList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center my-auto">
                  <MessageSquareText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">
                    No customer reviews received yet.
                  </p>
                </div>
              ) : (
                reviewsList.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${star <= rev.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-slate-200"
                              }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {rev.comment ? (
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        No comment left.
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}