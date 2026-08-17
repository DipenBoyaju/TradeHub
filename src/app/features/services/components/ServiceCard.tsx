"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, User } from "lucide-react";
import { PublicServiceItem } from "../types/services.types";

interface PublicServiceCardProps {
  service: PublicServiceItem;
}

export function ServiceCard({ service }: PublicServiceCardProps) {
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
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white pb-4"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={mainImage}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {/* Category Badge */}
        <span className="absolute left-3 top-3 rounded-full bg-slate-900/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          {service.category?.name || "General"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating & Views Header */}
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate capitalize">{service.location}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{service.averageRating > 0 ? service.averageRating.toFixed(1) : "New"}</span>
            <span className="text-slate-400">({service.totalReviews})</span>

            <div className="text-xs text-primary">
              10 reviews
            </div>
          </div>
        </div>

        <h3 className="line-clamp-1 font-heading text-base font-bold text-slate-800 group-hover:text-primary transition-colors duration-500 ease-in-out capitalize">
          {service.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs text-slate-500">{service.description}</p>
        <div className="pt-4 text-xs text-slate-500 flex items-center gap-2 capitalize">
          <User size={20} className="bg-primary text-white p-1 rounded-sm" />
          <p>By {service.providerName}</p>
        </div>
      </div>
    </Link>
  );
}