"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bot, CalendarClock, LineChart, Megaphone, Network, Sparkles, Users } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Mission Control", icon: Bot },
  { href: "/accounts", label: "Accounts", icon: Users },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/ideas", label: "Idea Studio", icon: Sparkles },
  { href: "/automations", label: "Automations", icon: Network },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/schedule", label: "Scheduler", icon: CalendarClock }
];

export function Sidebar() {
  const pathname = usePathname() || "/";

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-900 bg-slate-950/70">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 text-primary-300">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-200">Agentic</p>
          <p className="text-xs text-slate-400">Social Ops Control</p>
        </div>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              href={href}
              key={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-primary-500/10 text-primary-100"
                  : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-900 px-6 py-5 text-xs text-slate-500">
        Autonomous social media manager with multi-agent orchestration.
      </div>
    </aside>
  );
}
