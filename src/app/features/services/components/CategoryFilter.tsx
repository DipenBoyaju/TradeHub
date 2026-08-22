"use client";

import * as React from "react";
import { Tag, ChevronDown, Check } from "lucide-react";

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
}

interface CategoryDropdownProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onSelect: (value: string) => void;
}

export default function CategoryDropdown({
  categories,
  selectedCategory = "all",
  onSelect,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const allOptions = [
    { id: "all-option", slug: "all", name: "All Categories" },
    ...categories,
  ];

  const currentCategory =
    allOptions.find((cat) => cat.slug === selectedCategory) || allOptions[0];

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button - Increased Height & Styling */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-12 min-w-50 items-center justify-between gap-3 rounded-md border px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${selectedCategory !== "all"
          ? "border-emerald-500/50 bg-emerald-50/40 text-emerald-950 shadow-2xs"
          : "border-zinc-200 bg-white text-slate-800 hover:border-zinc-300 shadow-2xs"
          } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Tag
            className={`h-4 w-4 shrink-0 ${selectedCategory !== "all" ? "text-emerald-600" : "text-zinc-400"
              }`}
          />
          <span className="truncate">{currentCategory.name}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Styled Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-60 origin-top-left rounded-xl border border-zinc-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
            {allOptions.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelect(cat.slug);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer ${isSelected
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}