"use client"

import { ArrowUpRight, BookmarkX, MapPin, Star, Tag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react"
import { toggleWatchlistItem } from "../actions/watchlist.actions";

type FilterTab = "ALL" | "SERVICE" | "PROPERTY";

interface WatchlistViewProps {
  initialItems: any[]
}

export function WatchlistView({ initialItems }: WatchlistViewProps) {
  const [items, setItems] = useState(initialItems);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const hasServices = items.some((item) => item.type === "SERVICE");
  const hasProperties = items.some((item) => item.type === "PROPERTY");
  const showFilterBar = hasServices && hasProperties;

  const filtereditems = items.filter((item) => {
    if (activeFilter === "SERVICE") return item.type === "SERVICE";
    if (activeFilter === "PROPERTY") return item.type === "PROPERTY";
    return true
  })

  const handleRemove = async (entityId: string, type: "SERVICE" | "PROPERTY") => {

    const previousItems = items;
    setItems((prev) => prev.filter((item) => item.serviceId !== entityId && item.propertyId !== entityId));

    const res = await toggleWatchlistItem(entityId, type);

    if (!res.success) {
      setItems(previousItems);
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center">
        <BookmarkX className="h-12 w-12 text-primary mb-3" />
        <h3 className="text-base font-bold text-slate-800">Your Watchlist is Empty</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">
          Save services or properties you are interested in to easily access them later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Saved Items</h1>
          <p className="text-xs text-slate-500">
            {items.length} {items.length === 1 ? "item" : "items"} saved in your watchlist
          </p>
        </div>

        {showFilterBar && (
          <div className="flex items-center gap-1 rounded-md bg-white p-1 border border-slate-200/60">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${activeFilter === "ALL"
                ? "bg-primary text-slate-50 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
                }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setActiveFilter("SERVICE")}
              className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${activeFilter === "SERVICE"
                ? "bg-primary text-slate-50 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
                }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveFilter("PROPERTY")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${activeFilter === "PROPERTY"
                ? "bg-primary text-slate-50 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
                }`}
            >
              Properties
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5">
        {
          filtereditems.map((item) => {
            const isService = item.type === "SERVICE";
            const entity = isService ? item.service : item.property;

            if (!entity) return null;

            const image = entity.images?.[0] || "/placeholder-service.jpg"
            const detailUrl = isService ? `/services/${entity.slug}` : `/properties/${entity.slug}`;

            return (
              <div key={item.id} className="group relative flex md:flex-col items-center md:items-stretch gap-4 md:gap-0 rounded-2xl border border-slate-200/80 bg-white p-3 md:p-0 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden">
                <div className="relative h-20 w-20 md:h-44 md:w-full shrink-0 overflow-hidden rounded-xl md:rounded-b-none bg-slate-100">

                  <Image
                    src={image}
                    alt={entity.title}
                    fill
                    sizes="(max-width: 768px) 80px, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="hidden md:inline-flex absolute top-3 left-3 rounded-full bg-slate-900/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white tracking-wider uppercase">
                    {item.type}
                  </span>

                  <button
                    onClick={() => handleRemove(isService ? entity.id : entity.id, item.type)}
                    className="absolute top-2 right-2 md:top-3 md:right-3 rounded-full bg-white/90 p-1.5 text-slate-400 hover:text-red-600 hover:bg-white shadow-2xs transition-colors cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col justify-between md:p-4 min-w-0">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Tag className="h-3 w-3 text-primary" />
                        {entity.category?.name || "General"}
                      </span>

                      {/* Mobile Rating */}
                      {isService && entity.averageRating > 0 && (
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-800">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {entity.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                      {entity.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 capitalize">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{entity.location}</span>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 md:pt-3">
                    <span className="text-sm font-bold text-slate-900">
                      {entity.priceType === "NEGOTIABLE"
                        ? "Negotiable"
                        : entity.priceAmount
                          ? `NPR ${entity.priceAmount.toLocaleString()}`
                          : "Contact for Price"}
                    </span>

                    <Link
                      href={detailUrl}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
                    >
                      View Details
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
} 