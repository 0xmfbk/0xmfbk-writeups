import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

// -- Public (anon) client for read-only public data ---------------------
function publicClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

async function requireAdmin(ctx: { supabase: ReturnType<typeof publicClient>; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles" as never)
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

// SELECT column list — pinning/status/schedule fields kept in sync.
const PUBLIC_COLS =
  "id,title,slug,excerpt,tags,cover_image_url,created_at,order_index,is_pinned,status,published_at,scheduled_for";
const ADMIN_LIST_COLS =
  "id,title,slug,is_published,status,is_pinned,order_index,tags,created_at,updated_at,published_at,scheduled_for";

// ============================================================
// PUBLIC
// ============================================================
export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await sb
    .from("posts")
    .select(PUBLIC_COLS)
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_for.lte.${nowIso})`)
    .order("is_pinned", { ascending: false })
    .order("order_index", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPublishedPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const nowIso = new Date().toISOString();
    const { data: post, error } = await sb
      .from("posts")
      .select("*")
      .eq("slug", data.slug)
      .or(`status.eq.published,and(status.eq.scheduled,scheduled_for.lte.${nowIso})`)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return post;
  });

// ============================================================
// ADMIN
// ============================================================
const statusEnum = z.enum(["draft", "published", "scheduled", "archived"]);

const postInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/i, "slug must be url-safe"),
  excerpt: z.string().max(500).nullable().optional(),
  content: z.string().max(200_000),
  tags: z.array(z.string().max(40)).max(20),
  cover_image_url: z.string().url().nullable().optional().or(z.literal("").transform(() => null)),
  status: statusEnum,
  scheduled_for: z.string().datetime().nullable().optional(),
  is_pinned: z.boolean().default(false),
  order_index: z.number().int().default(0),
});

export const adminListAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase
      .from("posts")
      .select(ADMIN_LIST_COLS)
      .order("is_pinned", { ascending: false })
      .order("order_index", { ascending: false })
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { data: post, error } = await context.supabase.from("posts").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return post;
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => postInputSchema.parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);

    // Normalize status/scheduled_for/published_at rules.
    let status = data.status;
    let scheduled_for: string | null = data.scheduled_for ?? null;
    let published_at: string | null = null;

    // Load previous published_at when editing so we don't overwrite it.
    if (data.id) {
      const { data: prev } = await context.supabase
        .from("posts").select("published_at").eq("id", data.id).maybeSingle();
      published_at = prev?.published_at ?? null;
    }

    if (status === "scheduled") {
      if (!scheduled_for) throw new Error("scheduled_for is required when status is 'scheduled'");
      // If the scheduled time is already in the past, publish now.
      if (new Date(scheduled_for).getTime() <= Date.now()) {
        status = "published";
        published_at = published_at ?? new Date().toISOString();
        scheduled_for = null;
      }
    } else {
      scheduled_for = null;
    }

    if (status === "published" && !published_at) {
      published_at = new Date().toISOString();
    }

    const payload = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt ?? null,
      content: data.content,
      tags: data.tags,
      cover_image_url: data.cover_image_url || null,
      status,
      scheduled_for,
      published_at,
      is_pinned: data.is_pinned,
      is_published: status === "published" || status === "scheduled",
      order_index: data.order_index,
    };

    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("posts").update(payload).eq("id", data.id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase.from("posts").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Batch reorder + pin updates. Called by drag-and-drop UI.
const reorderSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().uuid(),
      order_index: z.number().int(),
      is_pinned: z.boolean(),
    }),
  ).min(1).max(500),
});

export const adminReorderPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => reorderSchema.parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    // Supabase JS has no bulk-update-by-values helper; run per-row updates in
    // parallel. Each is a single UPDATE by primary key so they're cheap.
    const results = await Promise.all(
      data.updates.map((u) =>
        context.supabase
          .from("posts")
          .update({ order_index: u.order_index, is_pinned: u.is_pinned })
          .eq("id", u.id),
      ),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);
    return { ok: true, count: data.updates.length };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles" as never)
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: Boolean(data), userId: context.userId };
  });
