"use client";
/*
  Design: Editorial Institutional Modernism — Card Deck Shuffler
  Approach: Pure CSS transitions, no framer-motion.
  Stack effect: CSS box-shadow layering on a single in-flow card element.
  Animation: CSS opacity + translateX transition on card swap.
*/
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { sections } from "@/lib/content";
import { GoldRule } from "./primitives";

const CARD_COUNT = sections.length;

const STACK_SHADOW =
  "8px 8px 0 0 #e8e4da, 16px 16px 0 0 #ddd8ce, 0 4px 24px 0 rgba(42,58,94,0.10)";

type Phase = "idle" | "exit" | "enter";

export default function CardDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [direction, setDirection] = useState<1 | -1>(1);
  const pendingIndex = useRef<number | null>(null);

  const navigate = useCallback(
    (nextIndex: number) => {
      if (phase !== "idle" || nextIndex === activeIndex) return;
      const dir = nextIndex > activeIndex ? 1 : -1;
      setDirection(dir);
      pendingIndex.current = nextIndex;
      setPhase("exit");
    },
    [phase, activeIndex]
  );

  const goNext = useCallback(() => {
    if (activeIndex < CARD_COUNT - 1) navigate(activeIndex + 1);
  }, [activeIndex, navigate]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) navigate(activeIndex - 1);
  }, [activeIndex, navigate]);

  // Handle phase transitions
  useEffect(() => {
    if (phase === "exit") {
      const t = setTimeout(() => {
        const next = pendingIndex.current!;
        setActiveIndex(next);
        setDisplayIndex(next);
        setPhase("enter");
      }, 210);
      return () => clearTimeout(t);
    }
    if (phase === "enter") {
      // Use two rAF frames so browser paints the enter (offset) state first,
      // then transitions to idle (opacity:1, translateX(0))
      let raf1: number;
      let raf2: number;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setPhase("idle");
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
  }, [phase]);

  const section = sections[displayIndex];
  const canGoNext = activeIndex < CARD_COUNT - 1;
  const canGoPrev = activeIndex > 0;
  const isAnimating = phase !== "idle";

  // CSS transition styles — idle always shows opacity:1, no transform
  const cardStyle: React.CSSProperties =
    phase === "exit"
      ? {
          transition: "opacity 200ms ease, transform 200ms ease",
          opacity: 0,
          transform: `translateX(${direction === 1 ? "-32px" : "32px"})`,
        }
      : phase === "enter"
      ? {
          // Start offset, transition will fire on next paint
          transition: "opacity 200ms ease, transform 200ms ease",
          opacity: 0,
          transform: `translateX(${direction === 1 ? "32px" : "-32px"})`,
        }
      : {
          // Idle: fully visible, no transform
          transition: "opacity 200ms ease, transform 200ms ease",
          opacity: 1,
          transform: "translateX(0)",
        };

  return (
    <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
      {/* ── Left: label + progress ── */}
      <div className="w-full max-w-xs shrink-0 lg:pt-6">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.28em]"
          style={{ color: "var(--gold)" }}
        >
          Table of Contents
        </p>
        <h2
          className="display mt-4 text-[clamp(2.25rem,4vw,3.5rem)]"
          style={{ color: "var(--navy)" }}
        >
          What&apos;s{" "}
          <span className="gold-italic">included</span>
          <br />
          in the manual.
        </h2>
        <GoldRule />
        <p className="mt-5 text-sm leading-7" style={{ color: "var(--muted-fg)" }}>
          Seven sections, 184 individual policies — fully indexed and
          cross-referenced. Click through each section to explore what&apos;s
          inside.
        </p>

        {/* Progress dots */}
        <div className="mt-8 flex items-center gap-2">
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i)}
              aria-label={`Go to section ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-[var(--gold)]"
                  : "w-2 bg-[var(--border)] hover:bg-[var(--gold)]/50"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next controls */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={!canGoPrev || isAnimating}
            aria-label="Previous section"
            className={`grid h-11 w-11 place-items-center rounded-full border transition ${
              canGoPrev && !isAnimating
                ? "border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
                : "cursor-not-allowed border-[var(--border)] text-[var(--border)]"
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "var(--muted-fg)" }}
          >
            {activeIndex + 1} / {CARD_COUNT}
          </span>
          <button
            onClick={goNext}
            disabled={!canGoNext || isAnimating}
            aria-label="Next section"
            className={`grid h-11 w-11 place-items-center rounded-full border transition ${
              canGoNext && !isAnimating
                ? "border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
                : "cursor-not-allowed border-[var(--border)] text-[var(--border)]"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Right: card with stacked shadow illusion ── */}
      <div className="w-full max-w-md">
        <div
          style={{
            borderRadius: "2px",
            boxShadow: STACK_SHADOW,
            marginBottom: "20px",
          }}
        >
          <div
            className="paper rounded-sm"
            onClick={canGoNext && !isAnimating ? goNext : undefined}
            role={canGoNext ? "button" : undefined}
            tabIndex={canGoNext ? 0 : undefined}
            onKeyDown={
              canGoNext
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goNext();
                    }
                  }
                : undefined
            }
            aria-label={canGoNext ? "Flip to next section" : undefined}
            style={{
              ...cardStyle,
              cursor: canGoNext && !isAnimating ? "pointer" : "default",
              userSelect: "none",
              color: "#2a3a5e",
            }}
          >
            <CardFront section={section} canFlip={canGoNext && !isAnimating} />
          </div>
        </div>

        {activeIndex === 0 && phase === "idle" && (
          <p
            className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "var(--muted-fg)" }}
          >
            Click the card or use the arrows to flip through
          </p>
        )}
      </div>
    </div>
  );
}

// ── Card face ─────────────────────────────────────────────────────────────────
function CardFront({
  section,
  canFlip,
}: {
  section: (typeof sections)[number];
  canFlip: boolean;
}) {
  return (
    <div className="flex flex-col p-8 md:p-10" style={{ minHeight: "460px" }}>
      {/* Card header */}
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: "#d9a85a" }}
          >
            Section
          </p>
          <p
            className="display mt-1 text-[4.5rem] leading-none"
            style={{ color: "#2a3a5e" }}
          >
            {section.label}
          </p>
        </div>
        <div className="text-right">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "#6e7388" }}
          >
            Spark Policy System
          </p>
          <p
            className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "#6e7388" }}
          >
            Edition I
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5">
        <GoldRule />
      </div>

      {/* Section title */}
      <h3
        className="display text-[clamp(1.75rem,3.5vw,2.5rem)]"
        style={{ color: "#2a3a5e" }}
      >
        {section.title}
      </h3>

      {/* Policy list */}
      <ul className="mt-5 flex-1 space-y-3">
        {section.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-6"
            style={{ color: "#48516b" }}
          >
            <span
              className="mt-[9px] h-px w-4 shrink-0"
              style={{ background: "#d9a85a" }}
            />
            {item}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div
        className="mt-6 flex items-center justify-between border-t pt-5"
        style={{ borderColor: "#e8e4da" }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: "#6e7388" }}
        >
          {section.items.length} policy areas
        </p>
        {canFlip && (
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "#d9a85a" }}
          >
            Next →
          </p>
        )}
      </div>
    </div>
  );
}
