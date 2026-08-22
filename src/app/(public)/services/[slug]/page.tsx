
import { getServiceBySlug } from "@/app/features/services/actions/service.action";
import ServiceBreadCrumb from "@/app/features/services/components/BreadCrumb";
import { ServiceGallery } from "@/app/features/services/components/ServiceGallery";
import { ReviewSection } from "@/components/shared/reviews/ReviewSection";
import { getAuthUser } from "@/lib/auth-utils";
import { MapPin, Eye, Phone, MessageSquare, ShieldCheck, Heart, Clock, User, Map, Lock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaStar } from "react-icons/fa";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { success, service } = await getServiceBySlug(slug);
  const user = await getAuthUser();

  const isAuthenticated = !!user;

  if (!success || !service) {
    notFound();
  }

  const cleanPhone = service.contactPhone.replace(/[^0-9+]/g, "");
  const cleanWhatsapp = service.whatsappNumber
    ? service.whatsappNumber.replace(/[^0-9]/g, "")
    : null;

  const loginRedirectUrl = `/login?redirectTo=/services/${slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      <ServiceBreadCrumb title={service.title} category={service.category?.name} />

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">

        <div className="order-1 lg:col-span-8">
          <ServiceGallery images={service.images} title={service.title} />
        </div>

        <div className="order-2 lg:col-span-4 lg:row-span-2">
          <div className="sticky top-6 rounded-2xl border border-zinc-200 p-6 space-y-6">

            <div className="border-b border-zinc-100 pb-5">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-3 leading-snug capitalize">
                {service.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1 font-medium text-zinc-700">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" /> {service.location}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-zinc-400" /> {service.viewsCount ?? 0} views
                </span>
                <span className="flex items-center gap-1">
                  <FaStar className="h-3.5 w-3.5 text-amber-300" /> {service.averageRating ?? 0} rating
                </span>
              </div>
            </div>

            <div>
              <span className="text-3xl font-bold tracking-tight text-zinc-900">
                {service.priceType === "NEGOTIABLE"
                  ? "Negotiable"
                  : `NPR ${service.priceAmount?.toLocaleString()}`}
              </span>
              {service.priceType !== "NEGOTIABLE" && (
                <span className="text-sm text-zinc-500 font-medium ml-1">
                  / {service.priceType.toLowerCase()}
                </span>
              )}
            </div>

            <div className="space-y-3 pt-2">
              {/* Call Provider Button */}
              {isAuthenticated ? (
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-transparent py-3.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  <Phone className="h-4 w-4" /> Call Provider
                </a>
              ) : (
                <Link
                  href={loginRedirectUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100"
                >
                  <Lock className="h-4 w-4 text-zinc-400" /> Sign in to Call
                </Link>
              )}

              {/* WhatsApp Button */}
              {cleanWhatsapp && (
                isAuthenticated ? (
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    <MessageSquare className="h-4 w-4" /> WhatsApp Message
                  </a>
                ) : (
                  <Link
                    href={loginRedirectUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-3.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                    <Lock className="h-4 w-4 text-emerald-500" /> Sign in for WhatsApp
                  </Link>
                )
              )}

              {/* Save to Watchlist Button */}
              {isAuthenticated ? (
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-zinc-50 transition-colors hover:bg-primary-hover mt-4"
                >
                  <Heart className="h-4 w-4 text-zinc-50" /> Save to Watchlist
                </button>
              ) : (
                <Link
                  href={loginRedirectUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 py-3.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 mt-4"
                >
                  <Lock className="h-4 w-4 text-zinc-400" /> Sign in to Save
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="order-3 lg:col-span-8 space-y-8">

          <div className="flex items-center justify-between pb-8 border-b border-zinc-200">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
                Provided by {service.providerName}
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-600">
                <ShieldCheck className="h-4 w-4" /> Verified Professional
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-base font-bold text-zinc-700 shrink-0">
              {service.providerName.charAt(0).toUpperCase()}
            </div>
          </div>

          <section className="pb-8 border-b border-zinc-200">
            <h3 className="text-lg font-semibold text-zinc-900 mb-3">About this service</h3>
            <div className="prose prose-zinc max-w-none text-zinc-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {service.description}
            </div>
          </section>

          <section className="pb-8 border-b border-zinc-200">
            <h3 className="text-lg font-semibold text-zinc-900 mb-6">Service Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-zinc-700">
              <div className="flex gap-3">
                <User className="h-5 w-5 text-zinc-400 shrink-0" />
                <div>
                  <p className="font-medium text-zinc-900">Primary Service</p>
                  <p className="text-zinc-500 mt-0.5">{service.serviceOffered}</p>
                </div>
              </div>

              {service.areasServiced && (
                <div className="flex gap-3">
                  <Map className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <p className="font-medium text-zinc-900">Coverage Area</p>
                    <p className="text-zinc-500 mt-0.5">{service.areasServiced}</p>
                  </div>
                </div>
              )}

              {service.experienceYears !== null && service.experienceYears !== undefined && (
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <p className="font-medium text-zinc-900">Experience</p>
                    <p className="text-zinc-500 mt-0.5">{service.experienceYears} Years</p>
                  </div>
                </div>
              )}

              {service.availability && (
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <p className="font-medium text-zinc-900">Availability</p>
                    <p className="text-zinc-500 mt-0.5">{service.availability}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="pt-2">
            <ReviewSection
              entityId={service.id}
              entityType="SERVICE"
              reviews={service.reviews}
              totalReviews={service.totalReviews}
              averageRating={service.averageRating}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>

      </div>
    </div>
  );
}