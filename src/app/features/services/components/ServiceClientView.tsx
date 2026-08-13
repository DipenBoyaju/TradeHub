"use client";

import { useState } from "react";
import { DasServiceCard } from "@/app/features/services/components/ServiceCard";
import { DasServiceList } from "@/app/features/services/components/ServiceList";
import { Grid2x2, List } from "lucide-react";
import { ServiceItem } from "@/app/features/services/types/services.types";
import { ServiceDetailModal } from "./ServiceDetailModal";
import { ServiceEditDrawer } from "./ServiceEditDrawer";
import { DeleteConfirmModal } from "./DeleteconfirmModal";
import { deleteService } from "../actions/services.action";

interface ServicesClientViewProps {
  initialServices: ServiceItem[];
}

export function ServicesClientView({ initialServices }: ServicesClientViewProps) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const [deletingService, setDeletingService] = useState<ServiceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenModal = (services: ServiceItem) => {
    setSelectedService(services);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleEditService = (services: ServiceItem) => {
    setEditingService(services);
    setIsEditDrawerOpen(true);
  }

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setEditingService(null);
  }

  const handleSaveService = () => { }

  const filteredServices = initialServices.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDeleteModal = (serviceId: string) => {
    const targetService = services.find((s) => s.id === serviceId);
    if (targetService) {
      setDeletingService(targetService);
    }
  };

  // 2. Executed when user clicks "Delete" inside modal
  const handleConfirmDelete = async () => {
    if (!deletingService) return;

    setIsDeleting(true);
    try {
      const response = await deleteService(deletingService.id);

      if (response.success) {
        // Remove item from local state list
        setServices((prev) => prev.filter((item) => item.id !== deletingService.id));
        setDeletingService(null);
      } else {
        alert(response.error || "Failed to delete service");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleStatusToggle = () => { }

  return (
    <div>
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
              <Grid2x2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${viewMode === "list"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:cursor-pointer"
                }`}
              title="List View"
            >
              <List className="h-4 w-4" />
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
            <DasServiceCard
              key={service.id}
              service={service}
              onViewDetails={handleOpenModal}
              onEdit={handleEditService}
              onDelete={handleOpenDeleteModal}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredServices.map((service) => (
            <DasServiceList
              key={service.id}
              service={service}
              onViewDetails={handleOpenModal}
              onEdit={handleEditService}
              onDelete={handleOpenDeleteModal}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      )}

      <ServiceDetailModal service={selectedService} isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* <ServiceEditDrawer service={editingService} isOpen={isEditDrawerOpen} onClose={handleCloseEditDrawer} onSave={handleSaveService} /> */}

      <DeleteConfirmModal
        isOpen={!!deletingService}
        title="Delete Service Listing"
        description="Are you sure you want to delete this service listing? This will permanently remove all associated images and details."
        itemName={deletingService?.title}
        isDeleting={isDeleting}
        onClose={() => setDeletingService(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}