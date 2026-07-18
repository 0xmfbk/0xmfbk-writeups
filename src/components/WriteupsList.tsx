import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { WriteupCard, type WriteupSummary } from "./WriteupCard";

export function WriteupsList({ posts }: { posts: WriteupSummary[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((p) => {
      return (
        p.title.toLowerCase().includes(needle) ||
        (p.excerpt ?? "").toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [q, posts]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="min-h-12 w-full rounded-md border border-border bg-card/60 pl-9 pr-3 py-2.5 font-mono text-sm placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {filtered.length} / {posts.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center font-mono text-sm text-muted-foreground">
          {posts.length === 0
            ? "// no writeups published yet. check back soon."
            : "// no matches for your query."}
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <WriteupCard key={p.id} post={p} index={i} />
          ))}
        </div>
      )}
    </section>

  );
}
