import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { PostEditor } from "@/components/PostEditor";

export const Route = createFileRoute("/_authenticated/9x7ktq3f8b2a/panel/new")({
  head: () => ({ meta: [{ title: "New writeup — 0xmfbk admin" }, { name: "robots", content: "noindex" }] }),
  component: NewPost,
});

function NewPost() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <PostEditor
        heading={
          <div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">New Writeup</h1>
          </div>
        }
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          content: "# Title\n\nStart writing…",
          tags: "",
          cover_image_url: "",
          status: "draft",
          scheduled_for_local: "",
          is_pinned: false,
          order_index: 0,
        }}
      />
    </div>
  );
}
