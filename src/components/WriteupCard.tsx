import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Clock, Hash } from "lucide-react";

export type WriteupSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[];
  cover_image_url?: string | null;
  created_at: string;
};

function estimateReadTime(text: string | null) {
  const words = (text ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function WriteupCard({ post, index = 0 }: { post: WriteupSummary; index?: number }) {
  const date = new Date(post.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        to="/writeups/$slug"
        params={{ slug: post.slug }}
        className="group relative block h-full overflow-hidden rounded-xl border border-border bg-card/60 p-5 transition hover:border-primary/50 hover:shadow-neon"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent opacity-0 transition group-hover:opacity-100" />

        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{estimateReadTime(post.excerpt)} min read</span>
        </div>

        <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        )}
        {post.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary"
              >
                <Hash className="h-2.5 w-2.5" />{t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 font-mono text-xs text-neon opacity-0 transition group-hover:opacity-100">
          → cat {post.slug}.md
        </div>
      </Link>
    </motion.div>
  );
}
