import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { generateIdeaAction, generateStrategyAction } from "./actions";
import { Sparkles, Wand2 } from "lucide-react";

export default async function IdeasPage() {
  const [ideas, campaigns] = await Promise.all([
    prisma.contentIdea.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="space-y-6 overflow-y-auto bg-slate-950/60 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Idea studio</h1>
        <p className="text-sm text-slate-400">
          Prompt the agent to architect content, campaigns, and multi-surface drops.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate single drop</CardTitle>
            <CardDescription>Provide context and let the copy agent draft platform-native messaging.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={generateIdeaAction} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Input name="brand" placeholder="Brand" defaultValue="Agentic" />
                <Input name="goal" placeholder="Objective" defaultValue="Drive awareness" />
              </div>
              <Textarea
                name="context"
                placeholder="Context for the drop, e.g. new feature launch, case study, win..."
                required
              />
              <div className="grid gap-3 md:grid-cols-3">
                <Select name="platform" defaultValue="x">
                  <option value="x">X (Twitter)</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </Select>
                <Input name="tone" placeholder="Tone" defaultValue="Bold & friendly" />
                <Select name="campaignId">
                  <option value="">Attach to campaign (optional)</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </Select>
              </div>
              <Button type="submit" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate draft
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Architect strategy</CardTitle>
            <CardDescription>Spin up a multi-pillar plan + backlog with a single brief.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={generateStrategyAction} className="space-y-3">
              <Input name="brand" placeholder="Brand" required />
              <Input name="goal" placeholder="North star goal" required />
              <Textarea name="audience" placeholder="Audience + positioning" required />
              <Input name="tone" placeholder="Voice & tone" defaultValue="Confident & human" />
              <Select name="platforms" multiple className="h-28" required>
                <option value="x">X</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
              </Select>
              <Button type="submit" className="gap-2">
                <Wand2 className="h-4 w-4" />
                Generate strategy
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent backlog</CardTitle>
          <CardDescription>Newest ideas ready for drafting & scheduling.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ideas.map((idea) => (
            <div key={idea.id} className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-100">{idea.prompt}</p>
                <Badge variant="outline">{idea.campaignId ? "Campaign" : "Standalone"}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-300">{idea.aiSummary}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                {idea.createdAt.toLocaleString()} · {idea.createdBy ?? "agent"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
