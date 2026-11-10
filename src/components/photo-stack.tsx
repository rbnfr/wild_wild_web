"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from "@/components/icon";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type PhotoStackLabels = {
  label: string;
  previous: string;
  next: string;
  pause: string;
  play: string;
  // "{current} de {total}"
  position: string;
};

// A horizontal drag longer than this (in pixels) turns the photograph.
const SWIPE_DISTANCE = 40;

/*
 * A pile of photographic prints: the one on top is tossed to the back of the
 * pile to reveal the next. It loops, turns by itself every `intervalMs`, and
 * can be driven by swiping, the buttons or the keyboard. The photographs are
 * rendered by the server and arrive as children, so no image code ships here.
 * All the movement is CSS (styles/photo-stack.css); this only tracks the order.
 */
export function PhotoStack({
  children,
  labels,
  intervalMs,
}: {
  children: ReactNode;
  labels: PhotoStackLabels;
  intervalMs: number;
}) {
  const photos = Children.toArray(children);
  const count = photos.length;
  const [index, setIndex] = useState(0);
  const [lastMove, setLastMove] = useState<"next" | "previous">();
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  // Reading or touching the pile holds it, without changing the pause button.
  const held = useRef(false);
  const dragStart = useRef<number | undefined>(undefined);
  const autoplay = !paused && !reducedMotion && count > 1;

  const turn = useCallback(
    (move: "next" | "previous") => {
      setLastMove(move);
      setIndex((value) => (value + (move === "next" ? 1 : -1) + count) % count);
    },
    [count],
  );

  // Restarts after every turn, so a manual turn gets its full time on top.
  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => {
      if (!held.current && !document.hidden) turn("next");
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [autoplay, index, intervalMs, turn]);

  const hold = () => {
    held.current = true;
  };
  const release = () => {
    held.current = false;
  };
  const endDrag = (event: PointerEvent) => {
    const start = dragStart.current;
    dragStart.current = undefined;
    if (start === undefined) return;
    const distance = event.clientX - start;
    if (Math.abs(distance) >= SWIPE_DISTANCE)
      turn(distance < 0 ? "next" : "previous");
  };

  return (
    <div
      className="photo-stack"
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.label}
      onPointerEnter={hold}
      onPointerLeave={release}
      onFocus={hold}
      onBlur={release}
    >
      <div
        className="photo-pile"
        onPointerDown={(event) => {
          dragStart.current = event.clientX;
        }}
        onPointerUp={endDrag}
        onPointerCancel={() => {
          dragStart.current = undefined;
        }}
      >
        {photos.map((photo, position) => {
          // 0 is the top of the pile; the last one is at the bottom.
          const depth = (position - index + count) % count;
          const animation =
            lastMove === "next" && depth === count - 1
              ? "is-tossed"
              : lastMove === "previous" && depth === 0
                ? "is-fetched"
                : "";
          return (
            <div
              key={position}
              className={`photo ${animation}`}
              style={{ "--depth": depth } as React.CSSProperties}
              aria-hidden={depth !== 0}
            >
              {photo}
            </div>
          );
        })}
      </div>
      {count > 1 && (
        <div className="photo-controls">
          <button
            type="button"
            aria-label={labels.previous}
            onClick={() => turn("previous")}
          >
            <ChevronLeftIcon />
          </button>
          <span aria-live={autoplay ? "off" : "polite"}>
            {labels.position
              .replace("{current}", String(index + 1))
              .replace("{total}", String(count))}
          </span>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => turn("next")}
          >
            <ChevronRightIcon />
          </button>
          {!reducedMotion && (
            <button
              type="button"
              className="photo-pause"
              aria-label={paused ? labels.play : labels.pause}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
            </button>
          )}
        </div>
      )}
      {/* The buttons need JavaScript; the top photograph does not. */}
      <noscript>
        <style>{".photo-controls{display:none}"}</style>
      </noscript>
    </div>
  );
}
