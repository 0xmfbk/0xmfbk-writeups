// src/components/ShareButton.tsx
import { useState, useRef, useEffect } from "react";
import { Share2, Link, Twitter, Linkedin, Send, Check } from "lucide-react";

type Props = {
  url: string;
  title: string;
  excerpt?: string;
};

export function ShareButton({ url, title, excerpt = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Web Share API (mobile devices)
  if (typeof navigator !== "undefined" && navigator.share) {
    return (
      <button
        onClick={() => navigator.share({ title, text: excerpt, url })}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary/50 hover:text-primary"
      >
        <Share2 className="h-4 w-4" /> Share
      </button>
    );
  }

  // Desktop fallback
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary/50 hover:text-primary"
      >
        <Share2 className="h-4 w-4" /> Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur-sm z-50">
          <button
            onClick={copyLink}
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-neon" /> : <Link className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            <Twitter className="h-4 w-4" /> Twitter/X
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            <Send className="h-4 w-4" /> Telegram
          </a>
        </div>
      )}
    </div>
  );
}