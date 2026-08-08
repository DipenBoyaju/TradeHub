"use client";

import Image from "next/image";
import { ServiceItem } from "./ServiceCard";

export function DasServiceList({ service }: { service: ServiceItem }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 hover:border-amber-300">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <Image src={service.images[0] || "/placeholder.jpg"} alt={service.title} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-xs font-bold text-slate-800">{service.title}</h4>
          <p className="text-[11px] text-slate-500">📍 {service.location} • {service.category.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <span className="text-xs font-bold text-amber-700">NPR {service.priceAmount}</span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Active</span>
        <button className="text-xs font-semibold text-slate-600 hover:text-amber-700">Edit</button>
      </div>
    </div>
  );
}