"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  isMobileOpen: boolean;
  isTabletCollapsed: boolean;
  onCloseMobile: () => void;
  onToggleTablet: () => void;
}

export function SidebarNav({
  isMobileOpen,
  isTabletCollapsed,
  onCloseMobile,
  onToggleTablet,
}: SidebarNavProps) {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "My Trade Hub",
      items: [
        { label: "Account details", href: "/my-trade-hub", icon: "👤" },
        { label: "Notifications", href: "/my-trade-hub/notifications", icon: "🔔" },
        { label: "Watchlist (1)", href: "/my-trade-hub/watchlist", icon: "👁️" },
        { label: "Favourites", href: "/my-trade-hub/favourites", icon: "❤️" },
      ],
    },
    {
      title: "Buying",
      items: [
        { label: "Won", href: "/my-trade-hub/won", icon: "🏆" },
        { label: "Lost (7)", href: "/my-trade-hub/lost", icon: "❌" },
        { label: "Fixed price offers (1)", href: "/my-trade-hub/offers", icon: "🏷️" },
      ],
    },
    {
      title: "Selling",
      items: [
        { label: "Services", href: "/my-trade-hub/services", icon: "➕" },
        { label: "Start a listing", href: "/my-trade-hub/services/new", icon: "➕" },
        { label: "Items I'm selling", href: "/my-trade-hub/selling", icon: "📦" },
      ],
    },
  ];

  return (
    <>
      {/* ---------------- MOBILE BACKDROP (SMALL SCREENS) ---------------- */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* ---------------- SIDEBAR CONTAINER ---------------- */}
      <aside
        className={`
          /* Base & Transition Setup */
          fixed top-0 left-0 z-50 h-full border-r border-slate-200 bg-zinc-100 transition-all duration-300 ease-in-out
          
          /* SMALL SCREENS (<768px): Sliding Drawer */
          w-64 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          
          /* MEDIUM SCREENS (768px - 1023px): Retractable Side Column */
          md:static md:translate-x-0 md:h-auto
          ${isTabletCollapsed ? "md:w-16 md:px-2" : "md:w-64 md:px-6"}
          
          /* LARGE SCREENS (1024px+): Permanently Fixed / Full Width */
          lg:w-64 lg:px-6 lg:translate-x-0
          py-8
        `}
      >
        {/* Mobile Close Button */}
        <div className="mb-6 flex items-center justify-between md:hidden px-2">
          <span className="text-sm font-bold text-slate-800">Navigation</span>
          <button
            onClick={onCloseMobile}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-200"
            aria-label="Close Mobile Menu"
          >
            ✕
          </button>
        </div>

        {/* Medium Screen Collapse/Expand Toggle Button Header */}
        <div className="hidden md:flex lg:hidden justify-end mb-4">
          <button
            onClick={onToggleTablet}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700 text-xs font-semibold flex items-center gap-1"
            title={isTabletCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            <svg
              className={`h-5 w-5 transform transition-transform ${isTabletCollapsed ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="space-y-7">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {/* Group Title: Shown when expanded or on desktop/mobile */}
              <h3
                className={`mb-2.5 text-xs font-bold tracking-wider text-slate-400 uppercase transition-opacity ${isTabletCollapsed
                  ? "md:hidden lg:block text-center"
                  : "block"
                  }`}
              >
                {group.title}
              </h3>

              <nav className="flex flex-col space-y-1">
                {group.items.map((item, itemIdx) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={onCloseMobile}
                      title={item.label}
                      className={`group flex items-center rounded-md py-2 px-1 text-[14px] font-medium transition-colors ${isActive
                        ? "text-blue-600 font-bold"
                        : "text-slate-600 hover:text-blue-600"
                        } ${isTabletCollapsed ? "md:justify-center lg:justify-start" : ""}`}
                    >
                      {/* Active Indicator Bar */}
                      <span
                        className={`mr-2 h-3 w-0.5 bg-blue-600 transition-opacity ${isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                          } ${isTabletCollapsed ? "md:hidden lg:block" : ""}`}
                      />

                      {/* Icon for Collapsed Mode on Medium Screens */}
                      <span className={`text-base ${isTabletCollapsed ? "md:block lg:hidden" : "hidden"}`}>
                        {item.icon}
                      </span>

                      {/* Full Label */}
                      <span
                        className={`truncate ${isTabletCollapsed ? "md:hidden lg:block" : "block"
                          }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}