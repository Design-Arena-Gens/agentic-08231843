import { Sidebar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { ShellSkeleton } from "@/components/dashboard/shell-skeleton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<ShellSkeleton />}>{children}</Suspense>
      </div>
    </div>
  );
}
