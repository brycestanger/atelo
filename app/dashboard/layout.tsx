import { Sidebar, MobileTopbar } from "@/components/app/dashboard-ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="lg:pl-60">
        <MobileTopbar />
        <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
