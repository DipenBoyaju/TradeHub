"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Eye } from "lucide-react";
import { PublicServiceItem } from "../types/services.types";

interface PublicServiceListProps {
  service: PublicServiceItem;
}

export function ServiceList({ service }: PublicServiceListProps) {
  const mainImage = service.images?.[0] || "/placeholder-service.jpg";

  const formatPrice = () => {
    if (service.priceType === "NEGOTIABLE") return "Negotiable";
    if (!service.priceAmount) return service.priceType;
    return `Rs. ${service.priceAmount.toLocaleString()} ${service.priceType === "HOURLY" ? "/ hr" : ""
      }`;
  };

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      {/* Image Thumbnail */}
      <div className="relative h-44 sm:h-auto sm:w-56 shrink-0 bg-slate-100">
        <Image
          src={mainImage}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, 224px"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-slate-900/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md sm:hidden">
          {service.category?.name || "General"}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="hidden sm:inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {service.category?.name || "General"}
            </span>
            <div className="flex items-center gap-1 font-semibold text-amber-500 text-xs">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{service.averageRating}</span>
            </div>
          </div>

          <h3 className="mt-1 font-heading text-lg font-bold text-slate-800 group-hover:text-primary transition-colors duration-500 ease-in-out">
            {service.title}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 capitalize">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{service.location}</span>
            <span className="text-slate-300">•</span>
            <span>By {service.providerName}</span>
          </div>

          <p className="mt-2 line-clamp-2 text-xs text-slate-500">{service.description}</p>

          <div className="text-xs text-primary pt-3">
            {service.totalReviews} reviews
          </div>
        </div>
      </div>
    </Link>
  );
}