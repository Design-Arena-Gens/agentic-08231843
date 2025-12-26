"use server";

import { prisma } from "@/lib/prisma";
import { draftSocialPost, generateCampaignPlan } from "@/lib/ai";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ideaSchema = z.object({
  brand: z.string().default("Agentic"),
  goal: z.string().default("Drive awareness"),
  platform: z.string().default("x"),
  context: z.string().min(4),
  tone: z.string().default("bold & friendly"),
  campaignId: z.string().optional()
});

export async function generateIdeaAction(formData: FormData) {
  const parsed = ideaSchema.parse({
    brand: formData.get("brand")?.toString() || "Agentic",
    goal: formData.get("goal")?.toString() || "Drive awareness",
    platform: formData.get("platform")?.toString() || "x",
    context: formData.get("context")?.toString() ?? "",
    tone: formData.get("tone")?.toString() || "bold & friendly",
    campaignId: formData.get("campaignId")?.toString() || undefined
  });

  const ai = await draftSocialPost({
    brand: parsed.brand,
    goal: parsed.goal,
    platform: parsed.platform,
    context: parsed.context,
    tone: parsed.tone
  });

  await prisma.contentIdea.create({
    data: {
      prompt: parsed.context,
      aiSummary: ai.caption,
      campaignId: parsed.campaignId,
      createdBy: "agent"
    }
  });

  revalidatePath("/ideas");
  revalidatePath("/");
}

const strategySchema = z.object({
  brand: z.string().min(2),
  goal: z.string().min(2),
  audience: z.string().min(2),
  tone: z.string().default("friendly"),
  platforms: z.array(z.string()).min(1)
});

export async function generateStrategyAction(formData: FormData) {
  const payload = strategySchema.parse({
    brand: formData.get("brand")?.toString() ?? "",
    goal: formData.get("goal")?.toString() ?? "",
    audience: formData.get("audience")?.toString() ?? "",
    tone: formData.get("tone")?.toString() || "friendly",
    platforms: formData.getAll("platforms").map((item) => item.toString())
  });

  const plan = await generateCampaignPlan(payload);

  await prisma.campaign.create({
    data: {
      name: `${payload.brand} · ${payload.goal}`,
      goal: payload.goal,
      audience: payload.audience,
      tone: plan.voice,
      status: "DRAFT",
      ideas: {
        create: plan.pillars.map((pillar) => ({
          prompt: pillar.title,
          aiSummary: pillar.description,
          createdBy: "agent"
        }))
      }
    }
  });

  revalidatePath("/ideas");
  revalidatePath("/campaigns");
}
