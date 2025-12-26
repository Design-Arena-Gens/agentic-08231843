import { prisma } from "@/lib/prisma";
import { createAccountAction } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_COLORS, PLATFORM_LABELS, formatDate, parseJson } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

export default async function AccountsPage() {
  const accounts = await prisma.socialAccount.findMany({
    include: {
      scheduledPosts: { take: 3, orderBy: { scheduledFor: "desc" } },
      analytics: { take: 1, orderBy: { date: "desc" } }
    }
  });

  return (
    <div className="space-y-6 overflow-y-auto bg-slate-950/60 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Connected surfaces</h1>
        <p className="text-sm text-slate-400">Bring your accounts under autonomous management.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add new account</CardTitle>
          <CardDescription>Securely store credentials and tokens for the agent swarm.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createAccountAction} className="grid gap-4 md:grid-cols-4">
            <Select name="platform" defaultValue="x">
              <option value="x">X (Twitter)</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
            </Select>
            <Input name="handle" placeholder="@brand" required />
            <Input name="accessToken" placeholder="Access token" />
            <Input name="refreshToken" placeholder="Refresh token" />
            <div className="md:col-span-4 flex justify-end">
              <Button type="submit" className="gap-2">
                <UploadCloud className="h-4 w-4" />
                Link surface
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => {
          const meta = parseJson<{ followers?: number; avgEngagement?: number }>(account.metadata, {});
          return (
            <Card key={account.id}>
              <CardHeader className="space-y-2">
                <Badge className={PLATFORM_COLORS[account.platform] ?? ""}>
                  {PLATFORM_LABELS[account.platform] ?? account.platform}
                </Badge>
                <CardTitle>{account.handle}</CardTitle>
              <CardDescription>Managed since {account.createdAt.toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div>
                <p className="text-xs text-slate-400">
                  Followers: {meta.followers?.toLocaleString?.() ?? "-"} · Avg engagement:{" "}
                  {meta.avgEngagement ?? "-"}%
                </p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Health snapshot</p>
                {account.analytics[0] ? (
                  <div className="mt-2 space-y-1 text-xs text-slate-400">
                    {(() => {
                      const metrics = parseJson<{ reach?: number; engagement?: number; ctr?: number }>(
                        account.analytics[0].metrics,
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
                ) : (
                  <p className="text-xs text-slate-500">No analytics yet.</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Latest drops</p>
                <div className="mt-2 space-y-2 text-xs text-slate-400">
                  {account.scheduledPosts.map((post) => (
                    <div key={post.id} className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-2">
                      <p className="font-medium text-slate-200">{post.status}</p>
                      <p className="line-clamp-2 text-slate-400">{post.content}</p>
                      <p className="text-[10px] text-slate-500">{formatDate(post.scheduledFor)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
