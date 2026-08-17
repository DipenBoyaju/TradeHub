"use client";

import { useState, FormEvent } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PublicServiceItem } from "../types/services.types";
import { Search, MapPin, Grid2x2, List, ArrowUpDown, Tag, X } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { ServiceList } from "./ServiceList";

interface ServicesPublicViewProps {
  initialServices: PublicServiceItem[];
  categories: { id: string; name: string; slug: string }[];
}

export function ServicesPublicView({ initialServices, categories }: ServicesPublicViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Local typing state for search box
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  // Helper to sync any dropdown / param changes to the URL bar
  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Search submit (Enter key or Search Button click)
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateUrlParam("q", searchInput.trim());
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchInput("");
    updateUrlParam("q", "");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center gap-2">
        <div className="relative flex flex-1 items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs">
          <Search className="h-5 w-5 text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            placeholder="Search services... (Press Enter or click Search)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full text-sm outline-none bg-transparent text-slate-800 pr-6"
          />
          {searchInput && (
            <button type="button" onClick={handleClearSearch} className="cursor-pointer text-slate-400">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white cursor-pointer">
          Search
        </button>
      </form>

      {/* Filter Bar Dropdowns */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
            <Tag className="h-4 w-4 text-slate-400" />
            <select
              value={searchParams.get("category") || "all"}
              onChange={(e) => updateUrlParam("category", e.target.value)}
              className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
            <MapPin className="h-4 w-4 text-slate-400" />
            <select
              value={searchParams.get("location") || "all"}
              onChange={(e) => updateUrlParam("location", e.target.value)}
              className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
              <option value="Pokhara">Pokhara</option>
            </select>
          </div>
        </div>

        {/* Sort & View Mode */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={searchParams.get("sort") || "latest"}
              onChange={(e) => updateUrlParam("sort", e.target.value)}
              className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer"
            >
              <option value="latest">Latest Listing</option>
              <option value="top-rated">Top Rated</option>
              <option value="most-viewed">Most Viewed</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-white text-blue-600" : "text-slate-500"}`}>
              <Grid2x2 className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-white text-blue-600" : "text-slate-500"}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initialServices.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {initialServices.map((service) => <ServiceList key={service.id} service={service} />)}
        </div>
      )}
    </div>
  );
}