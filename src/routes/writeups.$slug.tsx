import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { Markdown } from "@/components/Markdown";
import { getPublishedPostBySlug } from "@/lib/posts.functions";
import { ArrowLeft, Calendar, Hash } from "lucide-react";

export const Route = createFileRoute("/writeups/$slug")({
  loader: async ({ params }) => {
    const post = await getPublishedPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Writeup — 0xmfbk" }] };
    return {
      meta: [
        { title: `${loaderData.title} — 0xmfbk` },
        { name: "description", content: loaderData.excerpt ?? loaderData.title },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt ?? "" },
        { property: "og:type", content: "article" },
        ...(loaderData.cover_image_url
          ? [
              { property: "og:image", content: loaderData.cover_image_url },
              { name: "twitter:image", content: loaderData.cover_image_url },
            ]
          : []),
      ],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-3xl px-4 py-20 text-center font-mono">
        <p className="text-neon">$ cat writeup.md</p>
        <p className="mt-2 text-2xl font-bold">Writeup not found.</p>
        <Link to="/writeups" className="mt-6 inline-block text-primary underline">← back to /writeups</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center text-danger">{error.message}</div>,
});

function PostPage() {
  const post = Route.useLoaderData();
  const date = new Date(post.created_at).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
  return (
    <div className="min-h-screen">
      <NavBar />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Link
          to="/writeups"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" /> ../writeups
        </Link>

        <header className="mt-4">
          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{date}</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
          {post.excerpt && <p className="mt-2 text-lg text-muted-foreground">{post.excerpt}</p>}
          {post.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((t: string) => (
                <span key={t} className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
                  <Hash className="h-2.5 w-2.5" />{t}
                </span>
              ))}
            </div>
          ) : null}
          {post.cover_image_url && (
            <img src={post.cover_image_url} alt={post.title} className="mt-6 w-full rounded-lg border border-border" />
          )}
        </header>

        <hr className="my-8 border-border" />
        <Markdown content={post.content ?? ""} />
      </article>
    </div>
  );
}
