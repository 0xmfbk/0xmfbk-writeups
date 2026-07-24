// src/components/ReadingProgress.tsx
import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setWidth(Math.min(100, Math.max(0, scrolled)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 h-[2px] w-full bg-transparent pointer-events-none">
      <div
        className="h-full bg-neon/80 transition-all duration-75"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}