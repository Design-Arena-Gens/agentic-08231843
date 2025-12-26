"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export function Topbar({ onIdea }: { onIdea?: (query: string) => Promise<void> }) {
  const [prompt, setPrompt] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <header className="flex items-center justify-between border-b border-slate-900/60 bg-slate-950/40 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary-300">Agent Status</p>
        <h1 className="text-xl font-semibold text-slate-50">Autonomous social orchestration</h1>
      </div>
      <form
        className="flex items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!prompt.trim()) return;
          startTransition(async () => {
            await onIdea?.(prompt.trim());
            setPrompt("");
          });
        }}
      >
        <Input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask the agent for an idea, e.g. 'draft a product launch'"
          className="w-80"
        />
        <Button type="submit" variant="ghost" className="gap-2" disabled={isPending}>
          <Sparkles className="h-4 w-4" />
          {isPending ? "Thinking..." : "Ideate"}
        </Button>
      </form>
    </header>
  );
}
