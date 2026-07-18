import { motion } from "framer-motion";
import { Github, Globe, LinkedinIcon, MailIcon } from "lucide-react";
import avatar from "@/assets/avatar1.png";

const PORTFOLIO_URL = "https://mfbk.onrender.com/";

export function AuthorCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass neon-border relative overflow-hidden rounded-2xl p-5 sm:p-8"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-full bg-linear-to-br from-primary/60 to-accent/60 blur-md" />
          <img
            src={avatar}
            alt="Mustafa Faek Banikhalaf"
            className="relative h-40 w-40 rounded-full border-2 border-primary/70 object-cover shadow-neon sm:h-50 sm:w-50"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="mt-1 wrap-break-words text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl">
            Mustafa Faek Banikhalaf
          </h1>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-xs text-cyan sm:justify-start sm:text-sm">
            <span>Cybersecurity Associate · Offensive &amp; Defensive Security</span>
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mx-0">
            Cybersecurity Associate operating across both offensive and defensive disciplines. Backed by practical experience administering multi-platform Windows and Linux server environments and troubleshooting critical system infrastructure flaws. On the offensive side, I focus on web application penetration testing, mapping attack surfaces, and identifying OWASP Top 10 vulnerabilities. On the defensive side, I leverage my system administration background for infrastructure hardening and threat detection through enterprise log analysis using Splunk. I combine both mindsets to discover technical flaws and implement resilient, real-world security solutions.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Portfolio"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs transition hover:border-primary/50 hover:text-primary sm:w-auto"
            >
              <Globe className="h-4 w-4" /> Portfolio
            </a>
            <a
              href="https://linkedin.com/in/mustafabanikhalaf"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs transition hover:border-primary/50 hover:text-primary sm:w-auto"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/0xmfbk"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs transition hover:border-primary/50 hover:text-primary sm:w-auto"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="mailto:mustafabanikhalaf772@gmail.com"
              aria-label="Email"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs transition hover:border-primary/50 hover:text-primary sm:w-auto"
            >
              <MailIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
