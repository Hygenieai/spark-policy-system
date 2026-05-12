"use client";

/*
  Design philosophy: Editorial Institutional Modernism.
  The Square checkout step maintains the same ivory-paper, navy-gold visual language
  as the intake form so the two-step flow feels like a single coherent experience.

  Square Web Payments SDK docs: https://developer.squareup.com/docs/web-payments/overview
  Migration note: When moving to the Spark website, replace SQUARE_APP_ID and
  SQUARE_LOCATION_ID with production env vars and set NEXT_PUBLIC_SQUARE_ENV=production.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PACKAGE,
  SQUARE_APP_ID,
  SQUARE_ENV,
  SQUARE_LOCATION_ID,
  SQUARE_SDK_URL,
  type SquareCard,
} from "@/lib/square";
import { GoldRule, PaperSurface } from "./primitives";

type CheckoutStepProps = {
  practiceName: string;
  buyerEmail: string;
  onSuccess: (token: string) => void;
  onBack: () => void;
};

type SdkState = "loading" | "ready" | "error";
type PayState = "idle" | "processing" | "error";

export default function CheckoutStep({
  practiceName,
  buyerEmail,
  onSuccess,
  onBack,
}: CheckoutStepProps) {
  const cardRef = useRef<SquareCard | null>(null);
  const [sdkState, setSdkState] = useState<SdkState>("loading");
  const [payState, setPayState] = useState<PayState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Load the Square Web Payments SDK script once ──────────────────────────
  useEffect(() => {
    if (document.getElementById("square-sdk")) {
      initSquare();
      return;
    }
    const script = document.createElement("script");
    script.id = "square-sdk";
    script.src = SQUARE_SDK_URL;
    script.async = true;
    script.onload = () => initSquare();
    script.onerror = () => setSdkState("error");
    document.head.appendChild(script);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Initialise the Square Payments instance and attach the card widget ────
  const initSquare = useCallback(async () => {
    if (!window.Square) {
      setSdkState("error");
      return;
    }
    try {
      const payments = await window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
      const card = await payments.card({
        style: {
          input: {
            backgroundColor: "transparent",
            color: "#2a3a5e",
            fontFamily: "system-ui, sans-serif",
            fontSize: "15px",
          },
          "input::placeholder": { color: "#6e7388" },
          ".input-container": {
            borderColor: "rgba(42,58,94,0.25)",
            borderRadius: "0",
            borderWidth: "0 0 1px 0",
          },
          ".input-container.is-focus": { borderColor: "#d9a85a" },
          ".input-container.is-error": { borderColor: "#c0392b" },
        },
      });
      await card.attach("#square-card-container");
      cardRef.current = card;
      setSdkState("ready");
    } catch {
      setSdkState("error");
    }
  }, []);

  // ── Tokenise the card and call onSuccess ──────────────────────────────────
  async function handlePay() {
    if (!cardRef.current || payState === "processing") return;
    setPayState("processing");
    setErrorMessage(null);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status === "OK" && result.token) {
        onSuccess(result.token);
      } else {
        const msg =
          result.errors?.[0]?.message ??
          "Card verification failed. Please check your details and try again.";
        setErrorMessage(msg);
        setPayState("error");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setPayState("error");
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Step indicator */}
      <div className="mb-10 flex items-center gap-4">
        <StepBadge n="01" label="Practice details" done />
        <div className="h-px flex-1 bg-[var(--border)]" />
        <StepBadge n="02" label="Payment" active />
        <div className="h-px flex-1 bg-[var(--border)]" />
        <StepBadge n="03" label="Confirmation" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* ── Card entry panel ── */}
        <PaperSurface className="p-7 md:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">
            Secure payment
          </p>
          <h3 className="display mt-3 text-4xl text-[var(--navy)]">
            Enter your card details.
          </h3>
          <div className="my-6">
            <GoldRule />
          </div>

          {/* Buyer summary */}
          <div className="mb-7 grid gap-px bg-[var(--border)] sm:grid-cols-2">
            <SummaryCell label="Practice" value={practiceName || "—"} />
            <SummaryCell label="Email" value={buyerEmail || "—"} />
          </div>

          {/* Square card widget mount point */}
          <div className="relative min-h-[200px]">
            {sdkState === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner />
                <span className="ml-3 text-sm text-[var(--muted-fg)]">
                  Loading secure card entry…
                </span>
              </div>
            )}
            {sdkState === "error" && (
              <div className="rounded-sm border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                Square could not be loaded. Please refresh the page or contact support.
              </div>
            )}
            {/* Square mounts the card widget here */}
            <div
              id="square-card-container"
              className={sdkState !== "ready" ? "invisible" : ""}
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          )}

          {/* Sandbox notice */}
          {SQUARE_ENV === "sandbox" && (
            <p className="mt-5 rounded-sm border border-[var(--gold)]/40 bg-[var(--gold)]/8 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">
              MVP preview — sandbox mode. Use test card{" "}
              <span className="font-mono">4111 1111 1111 1111</span>, any future
              date, any CVV, any postal code.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-4 border-t border-[var(--border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="secondary-button"
              disabled={payState === "processing"}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handlePay}
              className="primary-button"
              disabled={sdkState !== "ready" || payState === "processing"}
            >
              {payState === "processing" ? (
                <span className="flex items-center gap-2">
                  <Spinner small /> Processing…
                </span>
              ) : (
                `Pay ${PACKAGE.priceLabel}`
              )}
            </button>
          </div>
        </PaperSurface>

        {/* ── Order summary sidebar ── */}
        <PaperSurface className="h-fit p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">
            Order summary
          </p>
          <div className="my-5">
            <GoldRule />
          </div>
          <p className="display text-3xl text-[var(--navy)]">{PACKAGE.name}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-fg)]">
            {PACKAGE.description}
          </p>
          <div className="my-6">
            <GoldRule />
          </div>
          <ul className="space-y-3">
            {[
              "184 individual policies",
              "7 fully indexed sections",
              "Named owner & approver fields",
              "Annual review cadence built in",
              "Single-practice PDF license",
              "Delivered to your email",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-6 text-[var(--ink-soft)]"
              >
                <span className="mt-[9px] h-px w-3 shrink-0 bg-[var(--gold)]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="my-6">
            <GoldRule />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted-fg)]">
              Total
            </span>
            <span className="display text-4xl text-[var(--navy)]">
              {PACKAGE.priceLabel}
            </span>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-[var(--muted-fg)]">
            One-time purchase · {PACKAGE.currency} · No subscription
          </p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-fg)]">
            <LockIcon />
            Secured by Square
          </div>
        </PaperSurface>
      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function StepBadge({
  n,
  label,
  done = false,
  active = false,
}: {
  n: string;
  label: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[11px] font-bold transition
          ${done ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--navy-deep)]" : ""}
          ${active ? "border-[var(--navy)] bg-[var(--navy)] text-white" : ""}
          ${!done && !active ? "border-[var(--border)] text-[var(--muted-fg)]" : ""}
        `}
      >
        {done ? "✓" : n}
      </div>
      <span
        className={`hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:block
          ${active ? "text-[var(--navy)]" : "text-[var(--muted-fg)]"}
        `}
      >
        {label}
      </span>
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#fdfbf6] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">
        {label}
      </p>
      <p className="mt-1 truncate text-sm text-[var(--navy)]">{value}</p>
    </div>
  );
}

function Spinner({ small = false }: { small?: boolean }) {
  const size = small ? "h-4 w-4" : "h-5 w-5";
  return (
    <svg
      className={`${size} animate-spin text-[var(--navy)]`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="6" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
