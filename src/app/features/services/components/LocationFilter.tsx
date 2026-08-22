"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NEPAL_LOCATIONS } from "@/lib/constants/locations";
import { ChevronDown, MapPin, X } from "lucide-react";

interface LocationFilterProps {
  currentProvince?: string;
  currentDistrict?: string;
}

export function LocationFilter({ currentProvince = "", currentDistrict = "" }: LocationFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const provinceParam = searchParams.get("province") || currentProvince;
  const districtParam = searchParams.get("district") || currentDistrict;

  const [isOpen, setIsOpen] = useState(false);
  const [province, setProvince] = useState(provinceParam);
  const [district, setDistrict] = useState(districtParam);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProvince(provinceParam);
    setDistrict(districtParam);
  }, [provinceParam, districtParam]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableDistricts = province ? NEPAL_LOCATIONS[province] || [] : [];

  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince);
    setDistrict("");
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (province) params.set("province", province);
    else params.delete("province");

    if (district) params.set("district", district);
    else params.delete("district");

    router.push(`/services?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setProvince("");
    setDistrict("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("province");
    params.delete("district");

    router.push(`/services?${params.toString()}`);
    setIsOpen(false);
  };

  // Label display logic for button trigger
  const getButtonLabel = () => {
    if (districtParam) return districtParam;
    if (provinceParam) return provinceParam;
    return "All Locations";
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-slate-800 outline-none cursor-pointer hover:bg-slate-50 transition-colors h-12 ${district !== ""
          ? "border-emerald-500/50 bg-emerald-50/40 text-emerald-950 shadow-2xs"
          : "border-zinc-200 bg-white text-slate-800 hover:border-zinc-300 shadow-2xs"
          }`}
      >
        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
        <span>{getButtonLabel()}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Location Filter</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Region / Province Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Region / Province</label>
            <div className="relative">
              <select
                value={province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full appearance-none rounded-md border h-12  border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="">All locations</option>
                {Object.keys(NEPAL_LOCATIONS).map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-4 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* District Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">District</label>
            <div className="relative">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!province}
                className="w-full appearance-none rounded-xl border h-12 border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {province ? "Select a district" : "Select a province first"}
                </option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-4 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-slate-600 underline hover:text-slate-700 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-md bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-primary-hover cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}