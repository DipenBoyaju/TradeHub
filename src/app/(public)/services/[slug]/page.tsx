import { getServiceBySlug } from "@/app/features/services/actions/service.action";
import { ServiceGallery } from "@/app/features/services/components/ServiceGallery";
import { MapPin, Eye, Phone, MessageSquare, ShieldCheck, Heart } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { success, service } = await getServiceBySlug(slug);

  if (!success || !service) {
    notFound();
  }

  const cleanPhone = service.contactPhone.replace(/[^0-9+]/g, "");
  const cleanWhatsapp = service.whatsappNumber
    ? service.whatsappNumber.replace(/[^0-9]/g, "")
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 text-xs text-slate-500">
        <span>Services</span> /{" "}
        <span className="font-medium text-slate-800">
          {service.category?.name || "General"}
        </span>
      </nav>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: Media, Description & Technical Specs */}
        <div className="lg:col-span-8 space-y-8">
          {/* Interactive Image Gallery */}
          <ServiceGallery images={service.images} title={service.title} />

          {/* Detailed Description */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
              Description
            </h2>
            <div className="prose prose-slate mt-4 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
              {service.description}
            </div>
          </section>

          {/* Key Details Table */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
              Service Details
            </h2>
            <div className="mt-4 divide-y divide-slate-100 text-sm">
              <div className="grid grid-cols-3 py-2.5">
                <span className="font-semibold text-slate-500">Business Name</span>
                <span className="col-span-2 font-medium text-slate-800">
                  {service.providerName}
                </span>
              </div>
              <div className="grid grid-cols-3 py-2.5">
                <span className="font-semibold text-slate-500">Services Offered</span>
                <span className="col-span-2 text-slate-800">
                  {service.serviceOffered}
                </span>
              </div>
              {service.areasServiced && (
                <div className="grid grid-cols-3 py-2.5">
                  <span className="font-semibold text-slate-500">Service Area</span>
                  <span className="col-span-2 text-slate-800">
                    {service.areasServiced}
                  </span>
                </div>
              )}
              {service.experienceYears !== null && service.experienceYears !== undefined && (
                <div className="grid grid-cols-3 py-2.5">
                  <span className="font-semibold text-slate-500">Experience</span>
                  <span className="col-span-2 text-slate-800">
                    {service.experienceYears} Years
                  </span>
                </div>
              )}
              {service.availability && (
                <div className="grid grid-cols-3 py-2.5">
                  <span className="font-semibold text-slate-500">Availability</span>
                  <span className="col-span-2 text-slate-800">
                    {service.availability}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Reviews Anchor */}
          <section id="reviews" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">
              Customer Reviews ({service.totalReviews ?? 0})
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Average Rating: {(service.avarageRating ?? 0).toFixed(1)} / 5.0
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN: Sidebar Info & Contact Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-6 space-y-6">
            {/* Service Header Info Card */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {service.location}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-slate-400" /> {service.viewsCount ?? 0} views
                </span>
              </div>

              <h1 className="text-2xl font-bold leading-tight text-slate-900">
                {service.title}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-600">
                  {service.priceType === "NEGOTIABLE"
                    ? "Negotiable"
                    : `NPR ${service.priceAmount?.toLocaleString()}`}
                </span>
                {service.priceType !== "NEGOTIABLE" && (
                  <span className="text-xs text-slate-400">
                    / {service.priceType.toLowerCase()}
                  </span>
                )}
              </div>

              {/* Dynamic Contact Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
                >
                  <Phone className="h-4 w-4" /> Call {service.contactPhone}
                </a>

                {cleanWhatsapp && (
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
                  >
                    <MessageSquare className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                )}

                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Heart className="h-4 w-4 text-slate-400" /> Save to Watchlist
                </button>
              </div>
            </div>

            {/* Seller/Provider Info Card */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                About the Provider
              </h3>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                  {service.providerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {service.providerName}
                  </h4>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Provider
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}