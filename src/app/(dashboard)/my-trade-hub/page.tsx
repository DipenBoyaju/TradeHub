import { getUserDetails } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function AccountDetailsPage() {
  const user = await getUserDetails();

  if (!user) {
    redirect("/login");
  }

  const firstInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  const profileDetails = [
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Location", value: user.profile?.address || "Not provided" },
    { label: "Contact", value: user.profile?.phoneNumber || "Not provided" },
    { label: "Member since", value: "June 2019" },
    { label: "Authenticated", value: "Yes", isStatus: true },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[#2c3e50] uppercase">
        Account Details
      </h1>

      {/* Profile header block */}
      <div className="mt-8 flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
          {firstInitial}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
          <p className="text-sm font-medium text-emerald-600">
            100% positive feedback <span className="text-xs text-slate-400">(4 ★)</span>
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {profileDetails.map((detail, idx) => (
          <div key={idx} className="flex py-4 text-[15px]">
            <span className="w-1/3 text-slate-500">
              {detail.label}
            </span>
            <span className="w-2/3 font-medium text-slate-900">
              {detail.isStatus ? (
                <span className="inline-flex items-center rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {detail.value}
                </span>
              ) : (
                detail.value
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}