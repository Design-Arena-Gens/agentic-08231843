import { Skeleton } from "@/components/ui/skeleton";

export function ShellSkeleton() {
  return (
    <div className="flex h-screen flex-col">
      <div className="border-b border-slate-900/60 bg-slate-950/40 px-6 py-4">
        <Skeleton className="h-10 w-80" />
      </div>
      <div className="grid flex-1 grid-cols-12 gap-6 bg-slate-950/70 p-6">
        <Skeleton className="col-span-8 h-64" />
        <Skeleton className="col-span-4 h-64" />
        <Skeleton className="col-span-12 h-96" />
      </div>
    </div>
  );
}
