import { Star } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { EntityType } from "@/lib/validations/reviewSchema";

interface BaseReview {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: Date;
}

interface ReviewSectionProps {
  entityId: string;
  entityType: EntityType;
  reviews: BaseReview[];
  totalReviews: number;
  averageRating: number;
  isAuthenticated: boolean;
}

export function ReviewSection({
  entityId,
  entityType,
  reviews = [],
  totalReviews = 0,
  averageRating = 0,
  isAuthenticated,
}: ReviewSectionProps) {
  return (
    <section id="reviews" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      {/* Summary Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Customer Reviews</h2>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
              <span className="ml-1 text-sm font-bold text-slate-800">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-slate-400">({totalReviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Review Submit Form */}
      <ReviewForm entityId={entityId} entityType={entityType} isAuthenticated={isAuthenticated} />

      {/* Reviews List */}
      <div className="space-y-4 pt-2">
        {reviews.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            No reviews yet. Be the first to leave a review!
          </p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b border-slate-100 pb-4 last:border-none">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">{rev.userName}</span>
                <span className="text-[11px] text-slate-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-1 flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      }`}
                  />
                ))}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-600">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}