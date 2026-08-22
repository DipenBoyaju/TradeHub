import { Header } from "@/components/shared/header/Header";
import { requiredAuthUser } from "@/lib/auth-utils";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await requiredAuthUser();
  return (
    <div className="flex min-h-full flex-col">
      <Header isAuthenticated={!!user} user={{ name: user?.name }} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
