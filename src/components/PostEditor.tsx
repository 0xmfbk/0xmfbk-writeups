import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { MDEditorClient } from "@/components/MDEditorClient";
import { Markdown } from "@/components/Markdown";
import { adminSavePost } from "@/lib/posts.functions";
import { Save, Eye, Pin } from "lucide-react";
import { AMMAN_TZ, ammanLocalToUtcISO, utcISOToAmmanLocalInput, formatAmman } from "@/lib/timezone";

export type PostStatus = "draft" | "published" | "scheduled" | "archived";

export type PostForm = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  cover_image_url: string;
  status: PostStatus;
  scheduled_for_local: string; // Amman local, "YYYY-MM-DDTHH:mm"
  is_pinned: boolean;
  order_index: number;
};

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function toPostForm(p: {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  tags: string[]; cover_image_url: string | null; status: PostStatus | string;
  scheduled_for: string | null; is_pinned: boolean; order_index: number;
}): PostForm {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    content: p.content ?? "",
    tags: (p.tags ?? []).join(", "),
    cover_image_url: p.cover_image_url ?? "",
    status: (p.status as PostStatus) ?? "draft",
    scheduled_for_local: utcISOToAmmanLocalInput(p.scheduled_for),
    is_pinned: !!p.is_pinned,
    order_index: p.order_index ?? 0,
  };
}

export function PostEditor({ initial, heading }: { initial: PostForm; heading: ReactNode }) {
  const navigate = useNavigate();
  const [form, setForm] = useState<PostForm>(initial);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const saveFn = useServerFn(adminSavePost);

  const mut = useMutation({
    mutationFn: () => {
      if (form.status === "scheduled" && !form.scheduled_for_local) {
        throw new Error("Pick a schedule date (Asia/Amman) or change the status.");
      }
      return saveFn({
        data: {
          id: form.id,
          title: form.title.trim(),
          slug: form.slug.trim() || slugify(form.title),
          excerpt: form.excerpt.trim() || null,
          content: form.content,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          cover_image_url: form.cover_image_url.trim() || null,
          status: form.status,
          scheduled_for: form.status === "scheduled"
            ? ammanLocalToUtcISO(form.scheduled_for_local)
            : null,
          is_pinned: form.is_pinned,
          order_index: Number(form.order_index) || 0,
        },
      });
    },
    onSuccess: () => {
      toast.success("Saved.");
      navigate({ to: "/9x7ktq3f8b2a/panel" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const scheduledPreview = form.status === "scheduled" && form.scheduled_for_local
    ? formatAmman(ammanLocalToUtcISO(form.scheduled_for_local))
    : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {heading}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-xs hover:text-accent"
          >
            <Eye className="h-4 w-4" /> {mode === "edit" ? "preview only" : "back to editor"}
          </button>
          <button
            type="button"
            disabled={mut.isPending || !form.title.trim()}
            onClick={() => mut.mutate()}
            className="inline-flex items-center gap-2 rounded-md border border-primary/60 bg-primary/20 px-4 py-2 font-mono text-sm text-primary hover:bg-primary/30 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {mut.isPending ? "saving…" : "save"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs text-muted-foreground">title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })}
              placeholder="XSS in the wild: bypassing WAFs with Unicode"
              className="w-full rounded-md border border-border bg-card/60 px-3 py-2 text-lg font-semibold focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-mono text-xs text-muted-foreground">slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                placeholder="my-writeup"
                className="w-full rounded-md border border-border bg-card/60 px-3 py-2 font-mono text-sm focus:border-primary/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-muted-foreground">tags (comma separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="web, xss, waf"
                className="w-full rounded-md border border-border bg-card/60 px-3 py-2 font-mono text-sm focus:border-primary/60 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-muted-foreground">excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              placeholder="Short summary used on cards and social share."
              className="w-full rounded-md border border-border bg-card/60 px-3 py-2 text-sm focus:border-primary/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>content (markdown — GFM)</span>
              <span className="opacity-60">{form.content.length.toLocaleString()} chars</span>
            </label>
            {mode === "edit" ? (
              <MDEditorClient
                value={form.content}
                onChange={(v) => setForm({ ...form, content: v })}
              />
            ) : (
              <div className="rounded-md border border-border bg-card/60 p-6">
                <Markdown content={form.content} />
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <h3 className="font-mono text-xs uppercase text-muted-foreground">status</h3>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PostStatus })}
              className="mt-2 w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-sm focus:border-primary/60 focus:outline-none"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="scheduled">scheduled</option>
              <option value="archived">archived</option>
            </select>

            {form.status === "scheduled" && (
              <div className="mt-3">
                <label className="mb-1 block font-mono text-xs text-muted-foreground">
                  release time ({AMMAN_TZ})
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduled_for_local}
                  onChange={(e) => setForm({ ...form, scheduled_for_local: e.target.value })}
                  className="w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-sm focus:border-primary/60 focus:outline-none"
                />
                {scheduledPreview && (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    goes live: <span className="text-neon">{scheduledPreview}</span>
                  </p>
                )}
              </div>
            )}

            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_pinned}
                onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <Pin className="h-3.5 w-3.5" /> pin to top
            </label>

            <label className="mt-3 block font-mono text-xs text-muted-foreground">order index</label>
            <input
              type="number"
              value={form.order_index}
              onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })}
              className="mt-1 w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-sm focus:border-primary/60 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Higher = shown first. Default 0.</p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-4">
            <h3 className="font-mono text-xs uppercase text-muted-foreground">cover image</h3>
            <input
              value={form.cover_image_url}
              onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
              placeholder="https://…"
              className="mt-2 w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-xs focus:border-primary/60 focus:outline-none"
            />
            {form.cover_image_url && (
              <img src={form.cover_image_url} alt="" className="mt-3 rounded border border-border" />
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
