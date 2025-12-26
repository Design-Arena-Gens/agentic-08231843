"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { draftSocialPost } from "@/lib/ai";
import { z } from "zod";

const ideaSchema = z.object({
  prompt: z.string().min(4),
  platform: z.string().default("x"),
  brand: z.string().default("Your brand"),
  goal: z.string().default("drive engagement"),
  tone: z.string().default("bold and friendly")
});

export async function createIdeaAction(input: { prompt: string; platform?: string }) {
  const parsed = ideaSchema.parse({ ...input, brand: "Agentic", goal: "ship more content", tone: "helpful" });

  const ai = await draftSocialPost({
    brand: parsed.brand,
    goal: parsed.goal,
    platform: parsed.platform,
    context: parsed.prompt,
    tone: parsed.tone
  });

  await prisma.contentIdea.create({
    data: {
      prompt: parsed.prompt,
      aiSummary: ai.caption,
      createdBy: "agent",
      campaignId: null
    }
  });

  revalidatePath("/");
  revalidatePath("/ideas");
}

export async function createIdeaFromPromptAction(prompt: string) {
  await createIdeaAction({ prompt, platform: "x" });
}
