import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { AuthorCard } from "@/components/AuthorCard";
const SKILLS = [
  "Web App Pentesting",
  "Python Scripting",
  "SIEM / Log Analysis",
  "Network Security",
  "Linux / Windows Internals",
  "IT Infrastructure",
];
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About" },
      {
        name: "description",
        content:
          "About Mustafa Faek Banikhalaf (0xmfbk) — Cybersecurity Associate specializing in offensive and defensive security, web app pentesting, and Python security tooling.",
      },
      { property: "og:title", content: "About" },
      {
        property: "og:description",
        content: "Cybersecurity Associate · Offensive & Defensive Security.",
      },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: AboutPage,
});
function AboutPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:py-10">
        <div className="font-mono text-xs text-muted-foreground">
          <span className="text-neon">$</span> cat ./about.md
        </div>
        <AuthorCard />
        {/* <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-5 sm:p-7"
        >
          <h2 className="mb-3 font-mono text-lg text-neon">// whoami</h2>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              I'm Mustafa, a cybersecurity practitioner focused on the intersection of offensive
              testing and defensive monitoring. I break things carefully, then document what I
              learned so others don't repeat the same mistakes.
            </p>
            <p>
              My daily work spans web application penetration testing, custom tooling in Python, log
              analysis across enterprise SIEMs, and hardening the boring infrastructure that
              everything else runs on.
            </p>
          </div>
        </motion.section> */}
        {/* <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-5 sm:p-7"
        >
          <h2 className="mb-3 font-mono text-lg text-neon">// skills --list</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <span
                key={s}
                className="rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs text-cyan"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.section> */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass rounded-2xl p-5 sm:p-7"
        >
          <h2 className="mb-3 font-mono text-lg text-neon">// next</h2>
          <p className="text-sm text-muted-foreground">
            Read my latest research and notes over on{" "}
            <Link
              to="/writeups"
              className="text-primary underline underline-offset-4 hover:text-neon"
            >
              ~/writeups
            </Link>
            .
          </p>
        </motion.section>
        <footer className="border-t border-border/60 pt-6 text-center font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} 0xmfbk
        </footer>
      </main>
    </div>
  );
}
