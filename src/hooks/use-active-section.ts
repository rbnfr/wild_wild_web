"use client";

import { useEffect, useState } from "react";

// Reports which section crosses the middle of the viewport, so navigation can
// show where the reader is. Without IntersectionObserver nothing is marked.
export function useActiveSection(ids: readonly string[]): string | undefined {
  const [active, setActive] = useState<string>();
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -55% 0px" },
    );
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [ids]);
  return active;
}
