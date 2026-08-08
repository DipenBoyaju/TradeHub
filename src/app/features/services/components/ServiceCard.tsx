"use client";

import { useState } from "react";
import { MapPin, Eye, Pencil, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  providerName: string;
  priceType: "FIXED" | "HOURLY" | "NEGOTIABLE";
  priceAmount?: number | null;
  location: string;
  images: string[];
  category: { name: string };
  contactPhone: string;
  whatsappNumber?: string | null;
  isPublished?: boolean;
  viewsCount?: number;
}

interface DasServiceCardProps {
  service: ServiceItem;
  onViewDetails?: (service: ServiceItem) => void;
  onEdit?: (service: ServiceItem) => void;
  onDelete?: (serviceId: string) => void;
  onStatusToggle?: (serviceId: string, isPublished: boolean) => void;
}

export function DasServiceCard({
  service,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusToggle,
}: DasServiceCardProps) {
  const [isPublished, setIsPublished] = useState(service.isPublished ?? true);
  const displayImage = service.images[0] || "/placeholder-service.jpg";

  const formatPrice = () => {
    if (service.priceType === "NEGOTIABLE") return "Negotiable";
    if (!service.priceAmount) return "Contact for price";
    return `NPR ${service.priceAmount.toLocaleString()} ${service.priceType === "HOURLY" ? "/ hr" : ""
      }`;
  };

  const handleToggle = () => {
    const nextState = !isPublished;
    setIsPublished(nextState);
    if (onStatusToggle) {
      onStatusToggle(service.id, nextState);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-amber-300 hover:shadow-sm">

      {/* Top Banner & Status Controls */}
      <div className="relative aspect-21/9 w-full overflow-hidden bg-slate-100">
        <Image
          src={displayImage}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Category Pill */}
        <span className="absolute top-2.5 left-2.5 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
          {service.category.name}
        </span>

        {/* Status Badge Toggle */}
        <button
          type="button"
          onClick={handleToggle}
          className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur-xs transition-colors ${isPublished
              ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
              : "bg-amber-500/90 text-white hover:bg-amber-600"
            }`}
          title="Click to toggle visibility on marketplace"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          {isPublished ? "Active" : "Draft"}
        </button>

        {/* Price Tag Overlay on Image */}
        <div className="absolute bottom-2 left-2.5 text-white">
          <span className="text-xs font-bold">{formatPrice()}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-amber-700" /> {service.location}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Eye size={12} /> {service.viewsCount ?? 0} views
          </span>
        </div>

        <h3 className="mt-1 line-clamp-1 text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
          {service.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {service.description}
        </p>

        {/* Dashboard Action Bar */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100 text-xs">
          {/* Main Action: Open Detail Modal */}
          <button
            type="button"
            onClick={() => onViewDetails?.(service)}
            className="font-semibold text-amber-700 hover:text-amber-800 hover:underline text-[11px]"
          >
            Manage details →
          </button>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1">
            <Link
              href={`/services/${service.id}`}
              target="_blank"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              title="Preview public page"
            >
              <ExternalLink size={13} />
            </Link>

            <button
              type="button"
              onClick={() => onEdit?.(service)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-700"
              title="Edit service"
            >
              <Pencil size={13} />
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(service.id)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              title="Delete service"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}