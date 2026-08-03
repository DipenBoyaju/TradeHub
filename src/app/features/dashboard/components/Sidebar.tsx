"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav() {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "My Trade Hub",
      items: [
        { label: "Account details", href: "/my-trade-hub" },
        { label: "Notifications", href: "/my-trade-hub/notifications" },
        { label: "Watchlist (1)", href: "/my-trade-hub/watchlist" },
        { label: "Favourites", href: "/my-trade-hub/favourites" },
      ],
    },
    {
      title: "Buying",
      items: [
        { label: "Won", href: "/my-trade-hub/won" },
        { label: "Lost (7)", href: "/my-trade-hub/lost" },
        { label: "Fixed price offers (1)", href: "/my-trade-hub/offers" },
      ],
    },
    {
      title: "Selling",
      items: [
        { label: "Start a listing", href: "/my-trade-hub/services/new" },
        { label: "Items I'm selling", href: "/my-trade-hub/selling" },
      ],
    },
  ];

  return (
    <div className="space-y-7">
      {menuGroups.map((group, groupIdx) => (
        <div key={groupIdx}>
          <h3 className="mb-2.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
            {group.title}
          </h3>
          <nav className="flex flex-col space-y-1">
            {group.items.map((item, itemIdx) => {
              // Direct active link string verification
              const isActive = pathname === item.href;

              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className={`group flex items-center rounded-md py-1.5 text-[14px] font-medium transition-colors ${isActive
                    ? "text-blue-600 font-bold"
                    : "text-slate-600 hover:text-blue-600"
                    }`}
                >
                  {/* The indicator bar highlights permanently when active, and fades in on hover when resting */}
                  <span
                    className={`mr-2 h-3 w-0.5 bg-blue-600 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}