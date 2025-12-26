import { prisma } from "@/lib/prisma";
import { createCampaignAction } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_LABELS, parseJson } from "@/lib/utils";
import { AgentCampaignTimeline } from "@/components/dashboard/timeline";
import { Sparkles } from "lucide-react";

export default async function CampaignsPage() {
  const [campaigns, accounts] = await Promise.all([
    prisma.campaign.findMany({ include: { accounts: true, posts: true, tasks: true, ideas: true } }),
    prisma.socialAccount.findMany()
  ]);

  return (
    <div className="space-y-6 overflow-y-auto bg-slate-950/60 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Campaign orchestration</h1>
        <p className="text-sm text-slate-400">Spin up coordinated drops across surfaces.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Launch new campaign</CardTitle>
          <CardDescription>Brief the agent, attach surfaces, and let automation swarm handle the rest.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCampaignAction} className="grid gap-4 md:grid-cols-2">
            <Input name="name" placeholder="Campaign name" required />
            <Input name="goal" placeholder="Primary goal" />
            <Textarea name="audience" placeholder="Audience & context" className="md:col-span-2" />
            <Input name="tone" placeholder="Desired tone" />
            <div className="grid grid-cols-2 gap-2">
              <Input name="startDate" type="date" />
              <Input name="endDate" type="date" />
            </div>
            <Select name="accounts" multiple className="h-32" required>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {PLATFORM_LABELS[account.platform] ?? account.platform} · {account.handle}
                </option>
              ))}
            </Select>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Deploy campaign
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="space-y-2">
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>{campaign.goal}</CardDescription>
              <div className="flex flex-wrap gap-2">
                {campaign.accounts.map((connection) => {
                  const account = accounts.find((acc) => acc.id === connection.accountId);
                  if (!account) return null;
                  return (
                    <Badge key={connection.id} variant="outline">
                      {account.handle}
                    </Badge>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-400">
              <AgentCampaignTimeline campaign={campaign} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Automation swarm</p>
                <div className="mt-2 space-y-1">
                  {campaign.tasks.map((task) => {
                    const config = parseJson<Record<string, unknown>>(task.config, {});
                    return (
                      <div key={task.id} className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-2">
                        <p className="font-medium text-slate-200">{task.type}</p>
                        <pre className="mt-1 whitespace-pre-wrap text-[11px]">
                          {JSON.stringify(config, null, 2)}
                        </pre>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
