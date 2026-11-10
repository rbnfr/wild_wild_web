"use client";

import { useEffect, useRef, type RefObject } from "react";

export type DismissReason = "escape" | "outside";

// Reports Escape and clicks outside the container, so menus can close.
// The callback decides whether there is anything open to dismiss.
export function useDismiss(
  container: RefObject<HTMLElement | null>,
  onDismiss: (reason: DismissReason) => void,
) {
  const callback = useRef(onDismiss);
  useEffect(() => {
    callback.current = onDismiss;
  });
  useEffect(() => {
    const handle = (event: Event) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") callback.current("escape");
        // composedPath is fixed at dispatch: it still lists the container when
        // the clicked node (an icon, say) was replaced by a re-render.
      } else if (
        container.current &&
        !event.composedPath().includes(container.current)
      ) {
        callback.current("outside");
      }
    };
    document.addEventListener("keydown", handle);
    document.addEventListener("click", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      document.removeEventListener("click", handle);
    };
  }, [container]);
}
