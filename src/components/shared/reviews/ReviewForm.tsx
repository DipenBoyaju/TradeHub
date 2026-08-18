"use client";

import { useState, useTransition, ChangeEvent } from "react";
import { Star, Lock, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { EntityType } from "@/lib/validations/reviewSchema";
import { submitReview } from "@/app/features/services/actions/review.action";

interface ReviewFormProps {
  entityId: string;
  entityType: EntityType;
  isAuthenticated: boolean;
}

export function ReviewForm({ entityId, entityType, isAuthenticated }: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // Convert uploaded image files to Base64 strings for preview & submission
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 3) {
      toast.error("You can upload a maximum of 3 photos per review.");
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 2MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to submit a review.");
      return;
    }

    startTransition(async () => {
      const res = await submitReview({
        entityId,
        entityType,
        rating,
        comment,
        images, // Pass selected images array
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Thank you! Your review has been posted.");
        setComment("");
        setRating(5);
        setImages([]);
      }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
      {!isAuthenticated && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs p-4 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Lock className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Login to leave a review</h4>
          <p className="mt-0.5 text-xs text-slate-500">
            Sharing feedback requires a verified user account.
          </p>
          <Link
            href="/login"
            className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            Log In to Review
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Leave a Review</h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          <span className="mr-2 text-xs font-semibold text-slate-600">Your Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={!isAuthenticated}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 text-amber-400 focus:outline-none disabled:cursor-not-allowed"
            >
              <Star
                className={`h-5 w-5 transition-transform ${(hoverRating || rating) >= star ? "fill-amber-400" : "text-slate-300"
                  }`}
              />
            </button>
          ))}
        </div>

        {/* Comment Field */}
        <textarea
          rows={3}
          disabled={!isAuthenticated}
          placeholder="Share details about your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
        />

        {/* Image Attachment Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <label
              htmlFor="review-image-upload"
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors ${images.length >= 3 || !isAuthenticated ? "pointer-events-none opacity-50" : ""
                }`}
            >
              <ImagePlus className="h-4 w-4" />
              <span>Add Photos ({images.length}/3)</span>
            </label>
            <input
              id="review-image-upload"
              type="file"
              accept="image/*"
              multiple
              disabled={images.length >= 3 || !isAuthenticated}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Thumbnail Preview Area */}
          {images.length > 0 && (
            <div className="flex gap-2 pt-1">
              {images.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                >
                  <Image
                    src={imgSrc}
                    alt={`Preview ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isAuthenticated || isPending}
          className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}