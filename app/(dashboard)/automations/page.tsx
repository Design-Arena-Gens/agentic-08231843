import { prisma } from "@/lib/prisma";
import { createAutomationAction } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { parseJson } from "@/lib/utils";
import { Network, Zap } from "lucide-react";

export default async function AutomationsPage() {
  const [campaigns, automations] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.automationTask.findMany({ include: { campaign: true }, orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="space-y-6 overflow-y-auto bg-slate-950/60 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Automation swarm</h1>
        <p className="text-sm text-slate-400">Wire routines to listen, respond, and curate autonomously.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deploy automation</CardTitle>
          <CardDescription>Attach routines to campaigns. Config accepts JSON payload.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createAutomationAction} className="grid gap-4 md:grid-cols-3">
            <Select name="campaignId" required>
              <option value="">Select campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </Select>
            <Select name="type" defaultValue="LISTEN" required>
              <option value="LISTEN">Listen</option>
              <option value="MONITOR">Monitor</option>
              <option value="RESPOND">Respond</option>
              <option value="CURATE">Curate</option>
            </Select>
            <Textarea
              name="config"
              placeholder='{"keywords":["agentic"],"platforms":["x"]}'
              className="md:col-span-3"
              required
            />
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" className="gap-2">
                <Zap className="h-4 w-4" />
                Launch automation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active routines</CardTitle>
          <CardDescription>Live automations orchestrated by the agent swarm.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {automations.map((automation) => {
            const config = parseJson<Record<string, unknown>>(automation.config, {});
            const state = parseJson<Record<string, unknown> | null>(automation.state, null);

            return (
              <div key={automation.id} className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{automation.type}</Badge>
                  <Network className="h-4 w-4 text-slate-500" />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-100">{automation.campaign.name}</p>
                <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-400">
                  {JSON.stringify(config, null, 2)}
                </pre>
                {state && (
                  <pre className="mt-2 whitespace-pre-wrap text-[10px] text-emerald-300">
                    {JSON.stringify(state, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
