import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const duePosts = await prisma.scheduledPost.findMany({
    where: {
      status: "QUEUED",
      scheduledFor: {
        lte: now
      }
    }
  });

  await prisma.scheduledPost.updateMany({
    where: { id: { in: duePosts.map((post) => post.id) } },
    data: { status: "PUBLISHED", result: JSON.stringify({ message: "Auto-shipped via cron" }) }
  });

  return NextResponse.json({ processed: duePosts.length });
}
