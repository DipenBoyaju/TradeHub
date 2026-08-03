import { SidebarNav } from "@/app/features/dashboard/components/Sidebar";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white text-slate-800 antialiased">
      <aside className="w-64 border-r border-slate-100 bg-zinc-100 px-6 py-8">
        <SidebarNav />
      </aside>

      <main className="flex-1 bg-white px-12 py-8">
        <div className="max-w-3xl">
          <nav className="mb-6 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-slate-600 hover:underline">Home</Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-500">My Trade Me</span>
          </nav>
          {children}
        </div>
      </main>
    </div>
  );
}