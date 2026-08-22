"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Eye, Pencil, Trash2, ExternalLink } from "lucide-react";
import { ServiceItem } from "../types/services.types";
import { SafeImage } from "@/components/shared/SafeImage";

interface DasServiceListProps {
  service: ServiceItem;
  onViewDetails?: (service: ServiceItem) => void;
  onEdit?: (service: ServiceItem) => void;
  onDelete?: (serviceId: string) => void;
  onStatusToggle?: (serviceId: string, isPublished: boolean) => void;
}

export function DasServiceList({
  service,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusToggle,
}: DasServiceListProps) {
  const [isPublished, setIsPublished] = useState(service.isPublished ?? true);

  const formatPrice = () => {
    if (service.priceType === "NEGOTIABLE") return "Negotiable";
    if (!service.priceAmount) return "Contact for price";
    return `NPR ${service.priceAmount.toLocaleString()}${service.priceType === "HOURLY" ? "/hr" : ""
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white p-3 hover:border-amber-200 hover:shadow-xs transition-all">
      {/* Left Details Group */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-100">
          <SafeImage
            key={service.images?.[0] || "no-image"}
            src={service.images?.[0]}
            alt={service.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              onClick={() => onViewDetails?.(service)}
              className="truncate text-xs font-bold text-slate-800 hover:text-amber-700 cursor-pointer"
            >
              {service.title}
            </h4>
            <span className="hidden sm:inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
              {service.category.name}
            </span>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-amber-700" />
              {service.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Eye size={11} /> {service.viewsCount ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls & Price Group */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
        <span className="text-xs font-bold text-slate-900 font-mono">
          {formatPrice()}
        </span>

        {/* --- Interactive Switch Control --- */}
        <button
          type="button"
          onClick={handleToggle}
          className="group/toggle flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title={isPublished ? "Click to unpublish service" : "Click to publish service"}
        >
          <span className={`text-[10px] font-semibold ${isPublished ? "text-emerald-700" : "text-slate-500"}`}>
            {isPublished ? "Active" : "Draft"}
          </span>

          {/* Track & Thumb */}
          <div
            className={`relative inline-flex h-4 w-7 shrink-0 transition-colors duration-200 ease-in-out rounded-full ${isPublished ? "bg-emerald-500" : "bg-slate-300"
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out translate-y-0.5 ${isPublished ? "translate-x-3.5" : "translate-x-0.5"
                }`}
            />
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewDetails?.(service)}
            className="rounded-md px-2 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-50 cursor-pointer"
            title="Manage details"
          >
            Manage
          </button>

          <Link
            href={`/services/${service.slug}`}
            target="_blank"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Preview public page"
          >
            <ExternalLink size={13} />
          </Link>

          <button
            type="button"
            onClick={() => onEdit?.(service)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-700 cursor-pointer"
            title="Edit service"
          >
            <Pencil size={13} />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(service.id)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            title="Delete service"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}