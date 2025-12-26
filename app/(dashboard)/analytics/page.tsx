import { prisma } from "@/lib/prisma";
import { agenticInsightPrompt } from "@/lib/ai";
import { parseJson } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EngagementChart } from "@/components/dashboard/engagement-chart";

export default async function AnalyticsPage() {
  const [accounts, analytics] = await Promise.all([
    prisma.socialAccount.findMany(),
    prisma.analyticsSnapshot.findMany({ orderBy: { date: "asc" } })
  ]);

  const metricsByAccount = accounts.map((account) => {
    const snapshots = analytics.filter((metric) => metric.accountId === account.id);
    const totals = snapshots.map((item) => parseJson<{ reach?: number; engagement?: number; ctr?: number }>(item.metrics, {}));
    const totalReach = totals.reduce((acc, item) => acc + (item.reach ?? 0), 0);
    const totalEng = totals.reduce((acc, item) => acc + (item.engagement ?? 0), 0);
    const avgCtr =
      totals.reduce((acc, item) => acc + (item.ctr ?? 0), 0) / (totals.length || 1);
    return {
      account,
      totalReach,
      totalEng,
      avgCtr: Number(avgCtr.toFixed(2)),
      snapshots
    };
  });

  const summaryText = metricsByAccount
    .map((item) => `${item.account.handle} reach ${item.totalReach} engagement ${item.totalEng}`)
    .join(". ");

  const insight = await agenticInsightPrompt(summaryText || "No data yet");

  const data = Object.values(
    analytics.reduce<Record<string, { date: string; reach: number; engagement: number }>>((acc, item) => {
      const key = item.date.toISOString();
      const metrics = parseJson<{ reach?: number; engagement?: number }>(item.metrics, {});
      if (!acc[key]) {
        acc[key] = { date: key, reach: 0, engagement: 0 };
      }
      acc[key].reach += metrics.reach ?? 0;
      acc[key].engagement += metrics.engagement ?? 0;
      return acc;
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6 overflow-y-auto bg-slate-950/60 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Performance intelligence</h1>
        <p className="text-sm text-slate-400">Let the insight agent translate signals into direction.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent synopsis</CardTitle>
          <CardDescription>The most important move to make this week.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-200">{insight}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engagement trend</CardTitle>
          <CardDescription>Composite reach and engagement across surfaces.</CardDescription>
        </CardHeader>
        <CardContent>
          <EngagementChart data={data} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metricsByAccount.map(({ account, totalReach, totalEng, avgCtr }) => (
          <Card key={account.id}>
            <CardHeader>
              <CardTitle>{account.handle}</CardTitle>
              <CardDescription>{account.platform.toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Total reach</span>
                <Badge variant="outline">{totalReach.toLocaleString()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Total engagement</span>
                <Badge variant="outline">{totalEng.toLocaleString()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Average CTR</span>
                <Badge variant="outline">{avgCtr}%</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
