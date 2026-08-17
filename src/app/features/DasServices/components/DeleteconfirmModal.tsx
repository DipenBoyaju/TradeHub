"use client";

import { useEffect, useCallback } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export function DeleteConfirmModal({
  isOpen,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  // Handle ESC key press to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    },
    [isOpen, isDeleting, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      onClick={() => !isDeleting && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Dialog Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start gap-4">
          {/* Warning Icon Badge */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>

          {/* Dialog Text */}
          <div className="flex-1">
            <h3 id="delete-dialog-title" className="text-base font-bold text-slate-800">
              {title}
            </h3>

            <p id="delete-dialog-description" className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {description}
            </p>

            {/* Optional Highlighted Item Name */}
            {itemName && (
              <div className="mt-3 rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-xs font-semibold text-slate-700 truncate">
                "{itemName}"
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus:outline-hidden disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 focus:outline-hidden disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}