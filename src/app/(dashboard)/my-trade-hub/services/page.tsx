"use client";

import { useState } from "react";
import { DasServiceCard } from "@/app/features/services/components/ServiceCard";
import { DasServiceList } from "@/app/features/services/components/ServiceList";
import { Grid2x2, List } from "lucide-react";
import { ServiceItem } from "@/app/features/services/types/services.types";

const MOCK_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    title: "Professional Plumbing & Leak Repair",
    description: "Expert plumbing services for home and commercial properties. Pipe fixing, drainage cleaning, and tap installation.",
    providerName: "KTM Plumbing Solutions",
    priceType: "HOURLY",
    priceAmount: 800,
    location: "Kathmandu",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"],
    category: { name: "Plumbing" },
    contactPhone: "9800000001",
  },
  {
    id: "srv-2",
    title: "Complete House Cleaning & Deep Wash",
    description: "Deep home cleaning including carpets, sofa wash, kitchen degreasing, and bathroom sanitization.",
    providerName: "Everest Cleaners",
    priceType: "FIXED",
    priceAmount: 4500,
    location: "Lalitpur",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"],
    category: { name: "Cleaning & Housekeeping" },
    contactPhone: "9800000002",
  },
  {
    id: "srv-3",
    title: "Electrical Wiring & Circuit Maintenance",
    description: "Licensed electrician available for short-circuit repair, inverter setup, and complete home rewiring.",
    providerName: "Shrestha Electricals",
    priceType: "NEGOTIABLE",
    priceAmount: null,
    location: "Bhaktapur",
    images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"],
    category: { name: "Electrical" },
    contactPhone: "9800000003",
  },
];

export default function DasServicesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = MOCK_SERVICES.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header & Controls Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-heading">Manage Services</h1>
          <p className="text-sm text-slate-500">Control your service visibility and active marketplace listings</p>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search services or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 h-12 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
          />

          {/* View Mode Toggle Buttons */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${viewMode === "grid"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:cursor-pointer"
                }`}
              title="Grid View"
            >
              <Grid2x2 />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${viewMode === "list"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:cursor-pointer"
                }`}
              title="List View"
            >
              <List />
            </button>
          </div>
        </div>
      </div>

      {/* Services Listing Section */}
      {filteredServices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-sm font-medium text-slate-500">No services found matching your search.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <DasServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredServices.map((service) => (
            <DasServiceList key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}