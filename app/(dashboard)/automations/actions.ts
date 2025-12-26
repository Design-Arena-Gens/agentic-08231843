"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const automationSchema = z.object({
  campaignId: z.string(),
  type: z.enum(["LISTEN", "MONITOR", "RESPOND", "CURATE"]),
  config: z.string().min(2)
});

export async function createAutomationAction(formData: FormData) {
  const parsed = automationSchema.safeParse({
    campaignId: formData.get("campaignId")?.toString() ?? "",
    type: formData.get("type")?.toString() ?? "LISTEN",
    config: formData.get("config")?.toString() ?? ""
  });

  if (!parsed.success) {
    throw new Error("Invalid automation payload");
  }

  let config: Record<string, unknown>;
  try {
    config = JSON.parse(parsed.data.config);
  } catch (error) {
    throw new Error("Config must be valid JSON");
  }

  await prisma.automationTask.create({
    data: {
      campaignId: parsed.data.campaignId,
      type: parsed.data.type,
      config: JSON.stringify(config)
    }
  });

  revalidatePath("/automations");
  revalidatePath("/");
}
