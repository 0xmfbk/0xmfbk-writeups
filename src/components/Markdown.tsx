import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") ?? "";
  return (
    <div className="group relative">
      <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
        {lang && (
          <span className="rounded bg-muted/70 px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
            {lang}
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded border border-border bg-muted/70 p-1.5 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-primary"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          pre({ children }) {
            // Pass through — CodeBlock renders its own <pre>
            const child: any = Array.isArray(children) ? children[0] : children;
            if (child?.props?.className?.startsWith("language-")) {
              const raw = String(child.props.children ?? "").replace(/\n$/, "");
              return <CodeBlock className={child.props.className}>{raw}</CodeBlock>;
            }
            return <pre>{children}</pre>;
          },
          a({ href, children }) {
            const external = href?.startsWith("http");
            return (
              <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
