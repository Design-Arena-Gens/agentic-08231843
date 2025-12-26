import { prisma } from "@/lib/prisma";
import { createScheduledPostAction } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate, PLATFORM_LABELS } from "@/lib/utils";
import { CalendarClock, Send } from "lucide-react";

export default async function SchedulePage() {
  const [accounts, campaigns, posts] = await Promise.all([
    prisma.socialAccount.findMany(),
    prisma.campaign.findMany(),
    prisma.scheduledPost.findMany({ include: { account: true, campaign: true }, orderBy: { scheduledFor: "asc" } })
  ]);

  return (
    <div className="space-y-6 overflow-y-auto bg-slate-950/60 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Scheduler</h1>
        <p className="text-sm text-slate-400">Queue drops and let autopilot ship across every surface.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule new drop</CardTitle>
          <CardDescription>Choose account, craft copy, and set the flight time.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createScheduledPostAction} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Select name="accountId" required>
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {PLATFORM_LABELS[account.platform] ?? account.platform} · {account.handle}
                  </option>
                ))}
              </Select>
              <Select name="campaignId">
                <option value="">Attach to campaign (optional)</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </Select>
              <Input name="scheduledFor" type="datetime-local" required />
            </div>
            <Textarea name="content" placeholder="Copy to publish" required />
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Queue drop
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming queue</CardTitle>
          <CardDescription>All planned posts, ordered chronologically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{PLATFORM_LABELS[post.account?.platform ?? "x"]}</Badge>
                  <span>{post.account?.handle}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <CalendarClock className="h-3 w-3" />
                  {formatDate(post.scheduledFor)}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-200">{post.content}</p>
              <p className="mt-2 text-xs text-slate-500">
                Campaign: {post.campaign?.name ?? "Standalone"} · Status: {post.status}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
