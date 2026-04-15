import Link from "next/link";

export function UserBrandHeader() {
  return (
    <header className="bg-black px-6 py-5">
      <Link href="/" className="text-2xl font-extrabold text-white">
        Tokalot
      </Link>
    </header>
  );
}
