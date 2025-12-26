"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const scheduleSchema = z.object({
  accountId: z.string(),
  campaignId: z.string().optional(),
  content: z.string().min(4),
  scheduledFor: z.string()
});

export async function createScheduledPostAction(formData: FormData) {
  const parsed = scheduleSchema.parse({
    accountId: formData.get("accountId")?.toString() ?? "",
    campaignId: formData.get("campaignId")?.toString() || undefined,
    content: formData.get("content")?.toString() ?? "",
    scheduledFor: formData.get("scheduledFor")?.toString() ?? ""
  });

  await prisma.scheduledPost.create({
    data: {
      accountId: parsed.accountId,
      campaignId: parsed.campaignId || null,
      content: parsed.content,
      scheduledFor: new Date(parsed.scheduledFor),
      status: "QUEUED"
    }
  });

  revalidatePath("/schedule");
  revalidatePath("/");
}
