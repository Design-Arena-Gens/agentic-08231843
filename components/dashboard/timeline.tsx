import { Campaign, ScheduledPost } from "@prisma/client";
import { formatDate } from "@/lib/utils";

interface TimelineProps {
  campaign: Campaign & { posts: ScheduledPost[]; ideas: { id: string; prompt: string }[] };
}

export function AgentCampaignTimeline({ campaign }: TimelineProps) {
  const sortedPosts = campaign.posts.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Timeline</p>
      <div className="relative ml-3 border-l border-slate-800/80 pl-4">
        {sortedPosts.length === 0 && <p className="text-xs text-slate-500">No drops scheduled yet.</p>}
        {sortedPosts.map((post) => (
          <div key={post.id} className="mb-3">
            <div className="absolute -left-[9px] mt-1 h-3 w-3 rounded-full border border-primary-300 bg-slate-950" />
            <p className="text-xs font-semibold text-slate-200">{formatDate(post.scheduledFor)}</p>
            <p className="text-xs text-slate-400 line-clamp-2">{post.content}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600">{post.status}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Idea backlog</p>
        <ul className="mt-1 space-y-1 text-xs text-slate-400">
          {campaign.ideas.map((idea) => (
            <li key={idea.id} className="line-clamp-2">
              • {idea.prompt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
