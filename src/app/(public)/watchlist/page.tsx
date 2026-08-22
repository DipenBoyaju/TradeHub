import { getWatchlistItem } from "@/app/features/watchlist/actions/watchlist.actions";
import { WatchlistView } from "@/app/features/watchlist/components/WatchlistView";

export default async function WatchlistPage() {
  const watchlistItems = await getWatchlistItem();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <WatchlistView initialItems={watchlistItems} />
    </div>
  )
}