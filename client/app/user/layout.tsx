import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="absolute top-4 right-4 z-50">
        <UserButton afterSignOutUrl="/" />
      </div>
      {children}
    </div>
  );
}
