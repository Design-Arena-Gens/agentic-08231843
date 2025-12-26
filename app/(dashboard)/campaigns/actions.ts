"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const campaignSchema = z.object({
  name: z.string().min(3),
  goal: z.string().optional(),
  audience: z.string().optional(),
  tone: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  accounts: z.array(z.string()).optional()
});

export async function createCampaignAction(formData: FormData) {
  const accounts = formData.getAll("accounts").map((item) => item.toString());

  const parsed = campaignSchema.parse({
    name: formData.get("name")?.toString() ?? "",
    goal: formData.get("goal")?.toString() || undefined,
    audience: formData.get("audience")?.toString() || undefined,
    tone: formData.get("tone")?.toString() || undefined,
    startDate: formData.get("startDate")?.toString() || undefined,
    endDate: formData.get("endDate")?.toString() || undefined,
    accounts
  });

  await prisma.campaign.create({
    data: {
      name: parsed.name,
      goal: parsed.goal,
      audience: parsed.audience,
      tone: parsed.tone,
      startDate: parsed.startDate ? new Date(parsed.startDate) : null,
      endDate: parsed.endDate ? new Date(parsed.endDate) : null,
      accounts: {
        create: parsed.accounts?.map((accountId) => ({ accountId })) ?? []
      }
    }
  });

  revalidatePath("/campaigns");
  revalidatePath("/");
}
