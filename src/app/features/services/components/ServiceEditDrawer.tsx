"use client";

import { useState, useEffect } from "react";
import { ServiceItem } from "./ServiceCard";

interface ServiceEditDrawerProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedService: Partial<ServiceItem>) => Promise<void> | void;
}

export function ServiceEditDrawer({
  service,
  isOpen,
  onClose,
  onSave,
}: ServiceEditDrawerProps) {
  const [formData, setFormData] = useState<Partial<ServiceItem>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData(service);
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save service edit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-transform animate-in slide-in-from-right duration-200">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Edit Service</h2>
              <p className="text-[11px] text-slate-500">ID: {service.id}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex h-[calc(100vh-120px)] flex-col justify-between overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Service Title</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  required
                />
              </div>

              {/* Price Type & Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Rate Type</label>
                  <select
                    value={formData.priceType || "FIXED"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceType: e.target.value as ServiceItem["priceType"],
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden bg-white"
                  >
                    <option value="FIXED">Fixed Price</option>
                    <option value="HOURLY">Hourly Rate</option>
                    <option value="NEGOTIABLE">Negotiable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Amount (NPR)</label>
                  <input
                    type="number"
                    value={formData.priceAmount || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, priceAmount: Number(e.target.value) })
                    }
                    disabled={formData.priceType === "NEGOTIABLE"}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Location</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  required
                />
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contactPhone || ""}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">WhatsApp (Optional)</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber || ""}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}