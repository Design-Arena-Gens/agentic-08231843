"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const accountSchema = z.object({
  platform: z.string().min(2),
  handle: z.string().min(2),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional()
});

export async function createAccountAction(formData: FormData) {
  const parsed = accountSchema.safeParse({
    platform: formData.get("platform")?.toString() ?? "",
    handle: formData.get("handle")?.toString() ?? "",
    accessToken: formData.get("accessToken")?.toString() || undefined,
    refreshToken: formData.get("refreshToken")?.toString() || undefined
  });

  if (!parsed.success) {
    throw new Error("Invalid account payload");
  }

  await prisma.socialAccount.create({
    data: {
      platform: parsed.data.platform,
      handle: parsed.data.handle,
      accessToken: parsed.data.accessToken,
      refreshToken: parsed.data.refreshToken
    }
  });

  revalidatePath("/accounts");
  revalidatePath("/");
}
