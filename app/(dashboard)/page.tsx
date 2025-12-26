import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, PLATFORM_COLORS, PLATFORM_LABELS, parseJson } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";
import { createIdeaFromPromptAction } from "./actions";
import { EngagementChart } from "@/components/dashboard/engagement-chart";
import Link from "next/link";
import { Megaphone, Network, Play, Sparkles, Upload } from "lucide-react";

export default async function DashboardPage() {
  await ensureSeedData();

  const [accounts, campaigns, scheduled, ideas, analytics] = await Promise.all([
    prisma.socialAccount.findMany({ include: { scheduledPosts: { take: 3, orderBy: { scheduledFor: "asc" } } } }),
    prisma.campaign.findMany({
      include: { posts: { take: 3, orderBy: { scheduledFor: "asc" } }, tasks: true, accounts: true }
    }),
    prisma.scheduledPost.findMany({ orderBy: { scheduledFor: "asc" }, take: 6, include: { account: true, campaign: true } }),
    prisma.contentIdea.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.analyticsSnapshot.findMany({ orderBy: { date: "asc" } })
  ]);

  const upcomingPosts = scheduled.filter((post) => post.status === "QUEUED" || post.status === "DRAFT");
  const completedPosts = scheduled.filter((post) => post.status === "PUBLISHED");
  const autopilotScore = Math.min(100, Math.round((upcomingPosts.length / 12) * 100));

  const analyticsByDate = Object.values(
    analytics.reduce<Record<string, { date: string; reach: number; engagement: number }>>((acc, item) => {
      const key = item.date.toISOString().slice(0, 10);
      if (!acc[key]) {
        acc[key] = { date: key, reach: 0, engagement: 0 };
      }
      const metrics = parseJson<{ reach?: number; engagement?: number }>(item.metrics, {});
      acc[key].reach += metrics.reach ?? 0;
      acc[key].engagement += metrics.engagement ?? 0;
      return acc;
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  const primaryCampaign = campaigns[0];

  return (
    <div className="flex h-screen flex-col">
      <Topbar onIdea={createIdeaFromPromptAction} />
      <main className="flex-1 overflow-y-auto bg-slate-950/60 p-6">
        <section className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 lg:col-span-8">
            <CardHeader className="flex flex-col gap-1">
              <CardTitle>Agent mission dashboard</CardTitle>
              <CardDescription>Your autonomous social media team at work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Metric label="Autopilot coverage" value={`${autopilotScore}%`} helper="Next 7 days" variant="primary" />
                <Metric label="Queued drops" value={upcomingPosts.length.toString()} helper="Ready to ship" variant="neutral" />
                <Metric label="Shipped this week" value={completedPosts.length.toString()} helper="Posts published" variant="neutral" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-300">Performance trend</p>
                <EngagementChart data={analyticsByDate} />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/analytics">
                  <Play className="h-4 w-4" />
                  View deep dive
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-12 lg:col-span-4">
            <CardHeader>
              <CardTitle>Latest agent drops</CardTitle>
              <CardDescription>Next in the shipping lane.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingPosts.slice(0, 4).map((post) => (
                <div key={post.id} className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={PLATFORM_COLORS[post.account?.platform ?? "x"]}>
                      {PLATFORM_LABELS[post.account?.platform ?? "x"] ?? post.account?.platform}
                    </Badge>
                    <span className="text-xs text-slate-400">{formatDate(post.scheduledFor)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200 line-clamp-2">{post.content}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{post.campaign?.name ?? "Standalone"}</span>
                    <span className="flex items-center gap-1 text-primary-200">
                      <Upload className="h-3 w-3" />
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="justify-end">
              <Button asChild size="sm" variant="outline">
                <Link href="/schedule">Manage queue</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="mt-6 grid grid-cols-12 gap-6">
          <Card className="col-span-12 lg:col-span-7">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Primary campaign</CardTitle>
                <CardDescription>Agent timeline + connected automations.</CardDescription>
              </div>
              <Badge variant="success">{primaryCampaign?.status ?? "DRAFT"}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-4">
                <p className="text-sm font-semibold text-slate-100">{primaryCampaign?.name}</p>
                <p className="text-sm text-slate-300">{primaryCampaign?.goal}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-500">Connected accounts</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {primaryCampaign?.accounts?.map((account) => {
                    const acc = accounts.find((item) => item.id === account.accountId);
                    if (!acc) return null;
                    return (
                      <Badge key={account.id} variant="outline" className={PLATFORM_COLORS[acc.platform] ?? ""}>
                        {acc.handle}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Automation swarm</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {primaryCampaign?.tasks.map((task) => {
                    const config = parseJson<Record<string, unknown>>(task.config, {});
                    return (
                    <div key={task.id} className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{task.type}</Badge>
                        <Megaphone className="h-4 w-4 text-slate-500" />
                      </div>
                      <pre className="mt-3 whitespace-pre-wrap text-xs text-slate-400">
                        {JSON.stringify(config, null, 2)}
                      </pre>
                    </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-5">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Idea inbox</CardTitle>
                <CardDescription>AI-suggested drops queued by the agent.</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                auto
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {ideas.map((idea) => (
                <div key={idea.id} className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-3">
                  <p className="text-sm font-medium text-slate-100">{idea.prompt}</p>
                  <p className="mt-1 text-xs text-slate-400">{idea.aiSummary}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                    {idea.createdAt.toLocaleDateString()} · {idea.createdBy ?? "agent"}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="justify-end">
              <Button asChild size="sm">
                <Link href="/ideas">Open studio</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account command center</CardTitle>
              <CardDescription>All connected surfaces + health score.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {accounts.map((account) => {
                const latestMetrics = analytics
                  .filter((metric) => metric.accountId === account.id)
                  .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
                const meta = parseJson<{ followers?: number }>(account.metadata, {});

                return (
                  <div key={account.id} className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4">
                    <Badge className={PLATFORM_COLORS[account.platform] ?? ""}>
                      {PLATFORM_LABELS[account.platform] ?? account.platform}
                    </Badge>
                    <p className="mt-2 text-sm font-semibold text-slate-100">{account.handle}</p>
                    <p className="text-xs text-slate-400">
                      Followers: {meta.followers?.toLocaleString?.() ?? "-"}
                    </p>
                    {latestMetrics && (
                      <div className="mt-3 space-y-1 text-xs text-slate-400">
                        {(() => {
                          const metrics = parseJson<{ reach?: number; engagement?: number; ctr?: number }>(
                            latestMetrics.metrics,
                            {}
                          );
                          return (
                            <>
                              <p>Reach: {metrics.reach ?? "-"}</p>
                              <p>Engagement: {metrics.engagement ?? "-"}</p>
                              <p>CTR: {metrics.ctr ?? "-"}%</p>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="justify-end">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/accounts">
                  <Network className="h-4 w-4" />
                  Configure surfaces
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  helper,
  variant
}: {
  label: string;
  value: string;
  helper: string;
  variant: "primary" | "neutral";
}) {
  return (
    <div
      className={
        variant === "primary"
          ? "rounded-2xl border border-primary-500/40 bg-primary-500/10 p-4"
          : "rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4"
      }
    >
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-50">{value}</p>
      <p className="text-xs text-slate-500">{helper}</p>
    </div>
  );
}
