import OpenAI from "openai";
import { z } from "zod";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const socialPlanSchema = z.object({
  pillars: z.array(z.object({
    title: z.string(),
    description: z.string(),
    cadence: z.string(),
    formats: z.array(z.string())
  })),
  voice: z.string(),
  hashtags: z.array(z.string()),
  ctas: z.array(z.string())
});

export type SocialPlan = z.infer<typeof socialPlanSchema>;

export async function generateCampaignPlan(input: {
  brand: string;
  goal: string;
  audience: string;
  tone: string;
  platforms: string[];
}) {
  if (!openai) {
    return {
      pillars: [
        {
          title: "Behind-the-scenes",
          description: `Share an authentic look at how ${input.brand} delivers on its promise.`,
          cadence: "2× weekly",
          formats: ["Reels", "Stories", "Thread"]
        },
        {
          title: "Proof & Social",
          description: "Highlight success stories, testimonials, and community wins to build trust.",
          cadence: "1× weekly",
          formats: ["Carousel", "LinkedIn post", "Short"]
        }
      ],
      voice: "Confident, actionable, human-first with smart jokes when appropriate.",
      hashtags: ["#buildinpublic", "#creatoreconomy", "#brandstory"],
      ctas: ["Join the waitlist", "Book a strategy call", "Download the playbook"]
    } satisfies SocialPlan;
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: "You are an expert social media chief-of-staff designing multi-platform campaign strategies."
      },
      {
        role: "user",
        content: `Brand: ${input.brand}\nGoal: ${input.goal}\nAudience: ${input.audience}\nTone: ${input.tone}\nPlatforms: ${input.platforms.join(
          ", "
        )}. Return JSON strictly in this shape: {"pillars":[{"title":string,"description":string,"cadence":string,"formats":string[]}],"voice":string,"hashtags":string[],"ctas":string[]}.`
      }
    ]
  });

  const planOutput = response.output as any[] | undefined;
  const planContent = planOutput?.[0]?.content?.[0] as { type?: string; text?: string } | undefined;
  const planText = response.output_text ?? (planContent?.type === "output_text" ? planContent.text : undefined);
  const parsed = socialPlanSchema.parse(typeof planText === "string" ? JSON.parse(planText) : planText);
  return parsed;
}

const postSchema = z.object({
  caption: z.string(),
  assets: z.array(z.object({ type: z.string(), idea: z.string() })).optional(),
  hashtags: z.array(z.string()).optional(),
  variations: z.array(z.string()).optional()
});

export type GeneratedPost = z.infer<typeof postSchema>;

export async function draftSocialPost(input: {
  brand: string;
  goal: string;
  platform: string;
  context: string;
  tone: string;
}) {
  if (!openai) {
    return {
      caption: `🚀 ${input.brand} update: ${input.context} — helping us move closer to ${input.goal}. What do you think?`,
      assets: [
        { type: "image", idea: "Snapshot of the product in action with subtle overlay metrics." },
        { type: "story", idea: "Quick founder selfie explaining the announcement in 3 frames." }
      ],
      hashtags: [
        `#${input.brand.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        "#socialstrategy",
        "#growth"
      ].slice(0, 3)
    } satisfies GeneratedPost;
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: "You are a senior social media copywriter that produces scroll-stopping copy tailored per platform."
      },
      {
        role: "user",
        content: `Brand: ${input.brand}\nGoal: ${input.goal}\nPlatform: ${input.platform}\nTone: ${input.tone}\nContext: ${input.context}\nReturn JSON with this exact shape: {"caption":string,"assets":[{"type":string,"idea":string}], "hashtags":string[], "variations":string[]}.`
      }
    ]
  });

  const postOutput = response.output as any[] | undefined;
  const postContent = postOutput?.[0]?.content?.[0] as { type?: string; text?: string } | undefined;
  const postText = response.output_text ?? (postContent?.type === "output_text" ? postContent.text : undefined);
  const parsed = postSchema.parse(typeof postText === "string" ? JSON.parse(postText) : postText);
  return parsed;
}

export async function agenticInsightPrompt(summary: string) {
  if (!openai) {
    return `Key insight: ${summary}. Recommendation: Double down on content that highlights validation and co-creation. Benchmark engagement is within reach if you post at least 4× weekly.`;
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: "You are a growth analyst summarising campaign performance into decisive insights." },
      { role: "user", content: `Given this context: ${summary}. What is the most important action we must take this week?` }
    ]
  });

  return response.output_text || summary;
}
