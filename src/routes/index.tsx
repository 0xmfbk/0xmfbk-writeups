import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { AuthorCard } from "@/components/AuthorCard";
import { WriteupsList } from "@/components/WriteupsList";
import { listPublishedPosts } from "@/lib/posts.functions";

export const Route = createFileRoute("/")({
  loader: () => listPublishedPosts(),
  component: Home,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-danger">{error.message}</div>
  ),
});
function Home() {
  const posts = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl space-y-8 px-3 py-6 sm:space-y-10 sm:px-4 sm:py-10">
        <AuthorCard />
        <section>
          <WriteupsList posts={posts} />
        </section>
        <footer className="border-t border-border/60 pt-6 text-center font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} 0xmfbk · built with{" "}
          <span className="text-neon">&lt;/&gt;</span> and caffeine
        </footer>
      </main>
    </div>
  );
}
