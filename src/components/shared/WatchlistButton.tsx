"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleWatchlistItem, WatchlistEntityType } from "@/app/features/watchlist/actions/watchlist.actions";

interface SaveToWatchlistButtonProps {
  entityId: string;
  type: WatchlistEntityType;
  initialIsBookmarked?: boolean;
  isAuthenticated: boolean;
}

export function SaveToWatchlistButton({
  entityId,
  type,
  initialIsBookmarked = false,
  isAuthenticated,
}: SaveToWatchlistButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    // Optimistic UI update
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    const res = await toggleWatchlistItem(entityId, type, window.location.pathname);

    if (!res.success) {
      setIsBookmarked(previousState); // Revert on failure
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${isBookmarked
          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
          : "bg-primary text-zinc-50 hover:bg-primary-hover"
        }`}
    >
      <Heart
        className={`h-4 w-4 transition-transform ${isBookmarked ? "fill-red-500 text-red-500 scale-110" : "text-zinc-50"
          }`}
      />
      {isBookmarked ? "Saved in Watchlist" : "Save to Watchlist"}
    </button>
  );
}