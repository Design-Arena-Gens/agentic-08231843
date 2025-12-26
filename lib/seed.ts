import { prisma } from "@/lib/prisma";

const SAMPLE_ACCOUNTS = [
  {
    platform: "x",
    handle: "@agentic_brand",
    metadata: JSON.stringify({ followers: 12800, avgEngagement: 3.4 })
  },
  {
    platform: "linkedin",
    handle: "Agentic Ops",
    metadata: JSON.stringify({ followers: 5400, avgEngagement: 6.8 })
  },
  {
    platform: "instagram",
    handle: "@agentic.ops",
    metadata: JSON.stringify({ followers: 9800, avgEngagement: 4.9 })
  }
];

export async function ensureSeedData() {
  const accountCount = await prisma.socialAccount.count();
  if (accountCount > 0) return;

  const accounts = await prisma.$transaction(
    SAMPLE_ACCOUNTS.map((account) =>
      prisma.socialAccount.create({
        data: {
          platform: account.platform,
          handle: account.handle,
          metadata: account.metadata
        }
      })
    )
  );

  const campaign = await prisma.campaign.create({
    data: {
      name: "AI Launch System",
      goal: "Drive 300 qualified demo requests",
      audience: "Series A software founders",
      tone: "Bold, punchy, evidence-driven",
      status: "ACTIVE",
      accounts: {
        create: accounts.map((account) => ({ accountId: account.id }))
      }
    }
  });

  await prisma.contentIdea.createMany({
    data: [
      {
        prompt: "Show behind the scenes of the agentic workflow",
        aiSummary: "🎥 BTS: Follow how our agent orchestrates social drops across 5 platforms in 30 minutes.",
        campaignId: campaign.id,
        createdBy: "agent"
      },
      {
        prompt: "Share product validation milestone",
        aiSummary: "📈 100 teams shipped 1,200 posts with Agentic in April — here's what we learned.",
        campaignId: campaign.id,
        createdBy: "agent"
      }
    ]
  });

  const now = new Date();
  await prisma.scheduledPost.createMany({
    data: accounts.map((account, idx) => ({
      accountId: accounts[idx].id,
      campaignId: campaign.id,
      content: `Scheduled drop for ${account.handle}`,
      scheduledFor: new Date(now.getTime() + (idx + 1) * 36e5),
      status: "QUEUED"
    }))
  });

  await prisma.analyticsSnapshot.createMany({
    data: accounts.flatMap((account, idx) =>
      Array.from({ length: 5 }).map((_, offset) => ({
        accountId: accounts[idx].id,
        date: new Date(now.getTime() - offset * 86400000),
        metrics: JSON.stringify({
          reach: Math.round(5000 + Math.random() * 4000),
          engagement: Math.round(800 + Math.random() * 600),
          ctr: +(2 + Math.random() * 3).toFixed(2)
        })
      }))
    )
  });

  await prisma.automationTask.createMany({
    data: [
      {
        campaignId: campaign.id,
        type: "LISTEN",
        config: JSON.stringify({ keywords: ["agentic ops", "ai social manager"], platforms: ["x", "linkedin"] })
      },
      {
        campaignId: campaign.id,
        type: "RESPOND",
        config: JSON.stringify({ playbook: "reply_with_case_study", slaMinutes: 30 })
      },
      {
        campaignId: campaign.id,
        type: "CURATE",
        config: JSON.stringify({ sources: ["Product Hunt", "Twitter Lists"], cadence: "daily" })
      }
    ]
  });
}
