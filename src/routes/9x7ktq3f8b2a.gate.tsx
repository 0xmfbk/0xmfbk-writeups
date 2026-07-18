import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Terminal, Lock } from "lucide-react";

export const Route = createFileRoute("/9x7ktq3f8b2a/gate")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({ meta: [{ title: "Admin — 0xmfbk" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/9x7ktq3f8b2a/gate" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Access granted.");
      navigate({ to: redirect ?? "/9x7ktq3f8b2a/panel" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass neon-border relative w-full max-w-md rounded-xl p-6 sm:p-8">
        <div className="grid-bg pointer-events-none absolute inset-0 rounded-xl opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-muted-foreground">
            <Terminal className="h-3.5 w-3.5 text-neon" /> secure_shell --login
          </div>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold">
            <Lock className="h-5 w-5 text-neon" /> Admin Access
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Restricted zone. Only the site owner may authenticate.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block font-mono text-xs text-muted-foreground">email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-card/60 px-3 py-2 font-mono text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="root@0xmfbk"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-muted-foreground">password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-card/60 px-3 py-2 font-mono text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="********"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md border border-primary/60 bg-primary/20 py-2 font-mono text-sm font-bold text-primary transition hover:bg-primary/30 disabled:opacity-50"
            >
              {busy ? "authenticating…" : "→ sudo login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
