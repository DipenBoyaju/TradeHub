import Link from "next/link";

export default function Home() {

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-5xl font-bold ">Nepa<span className="text-emerald-600">Hub</span></h1>
      <Link href={"/services"} className="text-white bg-primary px-4 py-2">Services</Link>
      <Link href={"/my-trade-hub"} className="text-white bg-emerald-600 px-4 py-2">Dashboard</Link>

    </div>
  );
}
