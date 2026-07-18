import { motion } from "framer-motion";
import { Github, LinkedinIcon, MailIcon} from "lucide-react";
import avatar from "@/assets/avatar1.png";

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
            className="relative h-50 w-50 rounded-full border-2 border-primary/70 object-cover shadow-neon sm:h-50 sm:w-50 md:h-50 md:w-50"
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
            Hands-on experience in web application penetration testing, custom security scripting in{" "}
            <code>Python</code>, and enterprise log analysis. Bridging offensive and defensive
            domains with a solid foundation in IT infrastructure.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
            
            <a
              href="https://linkedin.com/in/mustafabanikhalaf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs transition hover:border-primary/50 hover:text-primary sm:w-auto"
            >
              <LinkedinIcon className="h-4 w-4" /> 
            </a>
            <a
              href="https://github.com/0xmfbk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs transition hover:border-primary/50 hover:text-primary sm:w-auto"
            >
              <Github className="h-4 w-4" /> 
            </a>
            <a
              href="mailto:mustafabanikhalaf772@gmail.com"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs transition hover:border-primary/50 hover:text-primary sm:w-auto"
            >
              <MailIcon className="h-4 w-4" /> 
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
