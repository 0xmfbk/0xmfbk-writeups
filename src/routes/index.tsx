import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { WriteupCard, type WriteupSummary } from "@/components/WriteupCard";
import { listPublishedPosts } from "@/lib/posts.functions";
import { WriteupsList } from "@/components/WriteupsList";

export const Route = createFileRoute("/")({
  loader: () => listPublishedPosts(),
  head: () => ({
    meta: [
      { title: "0xmfbk.sec - Writeups" },
      {
        name: "description",
        content:
          "Security writeups, notes, and research by Mustafa Faek Banikhalaf (0xmfbk). Web pentesting, tooling, and defensive analysis.",
      },
      { property: "og:title", content: "0xmfbk.sec - Writeups" },
      {
        property: "og:description",
        content: "Web pentesting, security tooling, and defensive research.",
      },
    ],
  }),
  component: Home,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-danger">{error.message}</div>
  ),
});
function Home() {
  const posts = Route.useLoaderData() as WriteupSummary[];
  const featured = posts.filter((p) => p.is_pinned).slice(0, 3);
  const standard = posts.filter((p) => !p.is_pinned);
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:py-10">
        {/* Compact terminal hero */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass neon-border grid-bg relative overflow-hidden rounded-2xl p-5 sm:p-7"
        >
          <div className="font-mono text-xs text-muted-foreground sm:text-sm"></div>
          <h1 className="mt-2 font-mono text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            <span className="text-neon">0xmfbk.sec</span>
            <span className="text-muted-foreground"> :: </span>
            <span>security writeups &amp; research</span>
          </h1>
          <Link
            to="/about"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs text-cyan transition hover:border-primary/50 hover:text-primary"
          >
            about me <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.section>
        {/* Featured (pinned) */}
        {featured.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-mono text-sm text-muted-foreground">
                <span className="text-neon">#</span> featured
              </h2>
              <span className="font-mono text-xs text-muted-foreground">
                {featured.length} pinned
              </span>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {featured.map((p, i) => (
                <WriteupCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </section>
        )}
        {/* All writeups */}
        <section className="space-y-3">
          <WriteupsList posts={standard} />
        </section>
        <footer className="border-t border-border/60 pt-6 text-center font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} 0xmfbk.sec · built with{" "}
          <span className="text-neon">&lt;/&gt;</span> and caffeine
        </footer>
      </main>
    </div>
  );
}
