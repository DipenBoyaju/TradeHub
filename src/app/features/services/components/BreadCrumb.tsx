"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BreadCrumbProps {
  title: string;
  category: string;
}

export default function ServiceBreadCrumb({ title, category }: BreadCrumbProps) {
  const router = useRouter();
  return (
    <div className="flex gap-4 items-center pb-4">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 underline-offset-3 underline hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back</span>
      </button>

      {/* Vertical Separator */}
      <span className="h-4 w-px bg-slate-200" aria-hidden="true" />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li>
            <Link href="/services" className="hover:text-slate-900 transition-colors">
              Services
            </Link>
          </li>
          <li className="text-slate-300">/</li>
          <li>
            <span className="font-medium text-slate-600">
              {category || "General"}
            </span>
          </li>
          <li className="text-slate-300">/</li>
          <li>
            <span className="font-semibold text-slate-900 capitalize line-clamp-1 max-w-50">
              {title || "Untitled Service"}
            </span>
          </li>
        </ol>
      </nav>
    </div>
  )
}