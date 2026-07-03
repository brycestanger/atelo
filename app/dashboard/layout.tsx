import { redirect } from "next/navigation";
import { Sidebar, MobileTopbar } from "@/components/app/dashboard-ui";
import { createClient } from "@/lib/supabase/server";
import { getAccount } from "@/lib/actions/projects";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require a signed-in user when Supabase is configured; demo mode stays open.
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }

  const account = await getAccount();

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar account={account} />
      <div className="lg:pl-60">
        <MobileTopbar />
        <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
