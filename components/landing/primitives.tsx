/*
  Design philosophy: Editorial Institutional Modernism.
  These route-local primitives preserve the premium policy-manual visual language while
  staying portable for a future migration into the main Spark website.
*/

import type { ReactNode } from "react";

export function Eyebrow({ children, centered = false }: { children: ReactNode; centered?: boolean }) {
  return <div className={`eyebrow ${centered ? "justify-center before:flex-1 after:h-px after:flex-1 after:bg-[var(--gold)]" : ""}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  italic,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  italic: string;
  intro?: string;
  align?: "left" | "center";
}) {
  const before = title.split(italic)[0] ?? "";
  const after = title.split(italic)[1] ?? "";

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Eyebrow centered={align === "center"}>{eyebrow}</Eyebrow>
      <h2 className="display mt-5 text-[clamp(2.25rem,4.2vw,3.75rem)] text-[var(--navy)]">
        {before}
        <span className="gold-italic">{italic}</span>
        {after}
      </h2>
      {intro ? <p className="mt-5 text-lg leading-8 text-[var(--muted-fg)]">{intro}</p> : null}
    </div>
  );
}

export function GoldRule() {
  return <div className="gold-rule" aria-hidden="true" />;
}

export function PaperSurface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`paper ${className}`}>{children}</div>;
}

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="field-label">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </span>
      {children}
    </label>
  );
}
