import { Link } from "@tanstack/react-router";
import { Menu, Terminal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function NavBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkBase =
    "rounded px-3 py-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition";

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-mono font-bold tracking-tight">
          <Terminal className="h-4 w-4 shrink-0 text-neon" />
          <span className="text-neon">0xmfbk.sec</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 font-mono text-sm md:flex">
          <Link
            to="/"
            className={linkBase}
            activeProps={{ className: "text-primary bg-primary/10" }}
            activeOptions={{ exact: true }}
          >
            ~/home
          </Link>
          <Link
            to="/writeups"
            className={linkBase}
            activeProps={{ className: "text-primary bg-primary/10" }}
          >
            ~/writeups
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-border bg-muted/40 font-mono text-neon transition hover:border-primary/60 hover:bg-primary/10 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 top-14.25 z-30 md:hidden"
          >
            <button
              type="button"
              aria-label="Close menu backdrop"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            />
            <motion.nav
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="glass grid-bg relative mx-3 mt-3 overflow-hidden rounded-xl border border-border/70 p-3"
            >
              <div className="flex flex-col gap-1 font-mono text-base">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center rounded-md px-4 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                  activeProps={{ className: "text-primary bg-primary/10" }}
                  activeOptions={{ exact: true }}
                >
                  ~/home
                </Link>
                <Link
                  to="/writeups"
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center rounded-md px-4 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                  activeProps={{ className: "text-primary bg-primary/10" }}
                >
                  ~/writeups
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
