"use client";
/*
  Design philosophy: Editorial Institutional Modernism.
  This is a non-gated visual demo of the full Spark Policy System purchase flow:
    Step 1 — Practice Details (pre-filled, read-only overview + editable form)
    Step 2 — Square Payment  (live Square card widget + order summary)
    Step 3 — Confirmation    (post-payment success screen)
  The demo is pre-seeded with sample practice data so the user can click through
  the entire sequence without entering anything. The Square widget is live in
  sandbox mode — use card 4111 1111 1111 1111 to test a real tokenize call.
*/
import { useCallback, useEffect, useRef, useState } from "react";
import { GoldRule, PaperSurface } from "@/components/landing/primitives";
import {
  PACKAGE,
  SQUARE_APP_ID,
  SQUARE_ENV,
  SQUARE_LOCATION_ID,
  SQUARE_SDK_URL,
  type SquareCard,
} from "@/lib/square";

// ── Types ─────────────────────────────────────────────────────────────────────
type FlowStep = 1 | 2 | 3;

const SAMPLE = {
  practiceName: "Lakewood Dermatology Associates",
  department: "Clinical Operations",
  ownerName: "Dr. Sarah Okonkwo, MD",
  buyerEmail: "admin@lakewoodderm.com",
  notes: "Replacing our 2019 binder-based policy set. Need HIPAA and OSHA sections prioritized.",
};

// ── Root component ────────────────────────────────────────────────────────────
export default function FlowDemo() {
  const [step, setStep] = useState<FlowStep>(1);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);

  function advance() {
    setStep((s) => Math.min(s + 1, 3) as FlowStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1) as FlowStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function restart() {
    setStep(1);
    setPaymentToken(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]" style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      {/* ── Top bar ── */}
      <header className="border-b border-[var(--border)] bg-[var(--paper)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="display text-xl text-[var(--navy)]"
              style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
            >
              Spark
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--gold)] sm:block">
              Policy System
            </span>
          </div>
          <a
            href="/"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--navy)] transition-colors"
          >
            ← Back to landing page
          </a>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <div className="border-b border-[var(--border)] bg-[var(--paper)] px-6 py-5">
        <div className="mx-auto max-w-5xl">
          <StepProgress current={step} />
        </div>
      </div>

      {/* ── Step content ── */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {step === 1 && <PracticeDetailsStep onNext={advance} />}
        {step === 2 && (
          <PaymentStep
            onBack={back}
            onSuccess={(token) => {
              setPaymentToken(token);
              advance();
            }}
          />
        )}
        {step === 3 && <ConfirmationStep paymentToken={paymentToken} onRestart={restart} />}
      </main>

      {/* ── Demo watermark ── */}
      <div className="fixed bottom-4 right-4 rounded border border-[var(--border)] bg-[var(--paper)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] shadow-sm">
        Flow Demo
      </div>
    </div>
  );
}

// ── Step progress indicator ───────────────────────────────────────────────────
function StepProgress({ current }: { current: FlowStep }) {
  const steps = [
    { n: 1, label: "Practice details" },
    { n: 2, label: "Payment" },
    { n: 3, label: "Confirmation" },
  ];
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex items-center gap-2.5">
            <div
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[11px] font-bold transition-all duration-300
                ${current > s.n ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--navy-deep)]" : ""}
                ${current === s.n ? "border-[var(--navy)] bg-[var(--navy)] text-white" : ""}
                ${current < s.n ? "border-[var(--border)] bg-transparent text-[var(--muted-fg)]" : ""}
              `}
            >
              {current > s.n ? "✓" : s.n}
            </div>
            <span
              className={`hidden text-[10px] font-bold uppercase tracking-[0.22em] sm:block transition-colors duration-300
                ${current === s.n ? "text-[var(--navy)]" : "text-[var(--muted-fg)]"}
              `}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`mx-4 h-px w-16 transition-colors duration-500
                ${current > s.n ? "bg-[var(--gold)]" : "bg-[var(--border)]"}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 1: Practice Details ──────────────────────────────────────────────────
function PracticeDetailsStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      {/* Left: form */}
      <div>
        <DemoStepHeader
          eyebrow="Step 01 of 03"
          title="Practice details"
          subtitle="Tell us about your practice so we can customize your manual. This information is pre-filled for the demo."
        />
        <PaperSurface className="mt-8 p-7 md:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <DemoField label="Practice name" value={SAMPLE.practiceName} />
            <DemoField label="Department" value={SAMPLE.department} />
            <DemoField label="Department owner / signer" value={SAMPLE.ownerName} />
            <DemoField label="Buyer email" value={SAMPLE.buyerEmail} />
            <div className="md:col-span-2">
              <DemoField label="Optional notes" value={SAMPLE.notes} multiline />
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-5 border-t border-[var(--border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-xs leading-6 text-[var(--muted-fg)]">
              This product is not legal advice. It is a document system for operational use
              and does not collect PHI.
            </p>
            <button className="primary-button" onClick={onNext} type="button">
              Continue to payment →
            </button>
          </div>
        </PaperSurface>
      </div>

      {/* Right: what you get */}
      <div className="space-y-6">
        <PaperSurface className="p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">
            What you're ordering
          </p>
          <div className="my-4"><GoldRule /></div>
          <p
            className="display text-2xl text-[var(--navy)]"
            style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          >
            {PACKAGE.name}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-fg)]">{PACKAGE.description}</p>
          <div className="my-4"><GoldRule /></div>
          <ul className="space-y-2.5">
            {[
              "184 individual policies",
              "7 fully indexed sections",
              "Named owner & approver fields",
              "Annual review cadence built in",
              "Single-practice PDF license",
              "Delivered to your email",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[var(--ink-soft)]">
                <span className="mt-[10px] h-px w-3 shrink-0 bg-[var(--gold)]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="my-4"><GoldRule /></div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted-fg)]">Total</span>
            <span
              className="display text-4xl text-[var(--navy)]"
              style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
            >
              {PACKAGE.priceLabel}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-[var(--muted-fg)]">
            One-time purchase · {PACKAGE.currency} · No subscription
          </p>
        </PaperSurface>

        {/* Demo note */}
        <div className="rounded border border-dashed border-[var(--gold)] bg-[#fdfbf6] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
            Demo note
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted-fg)]">
            Fields are pre-filled with sample data. In production, the customer fills
            these in before proceeding to Square checkout.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Square Payment ────────────────────────────────────────────────────
type SdkState = "loading" | "ready" | "error";
type PayState = "idle" | "processing" | "success" | "error";

function PaymentStep({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: (token: string) => void;
}) {
  const cardRef = useRef<SquareCard | null>(null);
  const [sdkState, setSdkState] = useState<SdkState>("loading");
  const [payState, setPayState] = useState<PayState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load Square SDK
  useEffect(() => {
    if (document.getElementById("square-sdk-flow")) {
      initSquare();
      return;
    }
    const script = document.createElement("script");
    script.id = "square-sdk-flow";
    script.src = SQUARE_SDK_URL;
    script.async = true;
    script.onload = () => initSquare();
    script.onerror = () => setSdkState("error");
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initSquare = useCallback(async () => {
    if (!window.Square) { setSdkState("error"); return; }
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
          ".input-container.is-focus": { borderColor: "#2a3a5e" },
          ".input-container.is-error": { borderColor: "#c0392b" },
        },
      });
      await card.attach("#square-card-flow");
      cardRef.current = card;
      setSdkState("ready");
    } catch {
      setSdkState("error");
    }
  }, []);

  async function handlePay() {
    if (!cardRef.current || sdkState !== "ready") return;
    setPayState("processing");
    setErrorMsg(null);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status === "OK" && result.token) {
        setPayState("success");
        setTimeout(() => onSuccess(result.token!), 600);
      } else {
        const msg = result.errors?.[0]?.message ?? "Card verification failed. Please check your details.";
        setErrorMsg(msg);
        setPayState("error");
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setPayState("error");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      {/* Left: card form */}
      <div>
        <DemoStepHeader
          eyebrow="Step 02 of 03"
          title="Secure payment"
          subtitle={`Completing purchase for ${SAMPLE.practiceName}. Your card is processed securely by Square — Spark never stores payment data.`}
        />

        <PaperSurface className="mt-8 p-7 md:p-10">
          {/* Buyer summary */}
          <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCell label="Practice" value={SAMPLE.practiceName} />
            <SummaryCell label="Department" value={SAMPLE.department} />
            <SummaryCell label="Signer" value={SAMPLE.ownerName} />
            <SummaryCell label="Email" value={SAMPLE.buyerEmail} />
          </div>

          <GoldRule />

          <div className="mt-7">
            <p className="field-label mb-4">Card details</p>

            {/* Square SDK loading state */}
            {sdkState === "loading" && (
              <div className="flex items-center gap-3 py-6 text-sm text-[var(--muted-fg)]">
                <Spinner small />
                Loading secure card entry…
              </div>
            )}

            {/* Square SDK error state */}
            {sdkState === "error" && (
              <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Unable to load Square payment widget. This demo uses sandbox credentials —
                ensure you are connected to the internet and the Square sandbox CDN is reachable.
              </div>
            )}

            {/* Square card widget mount point */}
            <div
              id="square-card-flow"
              className={sdkState !== "ready" ? "invisible h-0 overflow-hidden" : ""}
            />

            {/* Sandbox hint */}
            {sdkState === "ready" && (
              <div className="mt-4 rounded border border-dashed border-[var(--gold)] bg-[#fdfbf6] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
                  Sandbox mode — {SQUARE_ENV}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-[var(--muted-fg)]">
                  Use test card <strong className="text-[var(--navy)]">4111 1111 1111 1111</strong>,
                  any future expiry (e.g. 12/26), any CVV, and any postal code to tokenize a
                  test payment. No real charge will occur.
                </p>
              </div>
            )}

            {/* Error message */}
            {payState === "error" && errorMsg && (
              <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Demo bypass — only shown when Square SDK can't load */}
            {sdkState === "error" && (
              <div className="mt-4 rounded border border-dashed border-[var(--gold)] bg-[#fdfbf6] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
                  Demo bypass
                </p>
                <p className="mt-1.5 text-xs leading-5 text-[var(--muted-fg)]">
                  The Square sandbox CDN is blocked in this preview environment. In a real browser
                  the card widget loads normally. Click below to see the confirmation screen.
                </p>
                <button
                  type="button"
                  onClick={() => onSuccess("DEMO-TOKEN-PREVIEW-" + Date.now())}
                  className="primary-button mt-4"
                >
                  Skip to confirmation →
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-4 border-t border-[var(--border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="secondary-button"
              disabled={payState === "processing"}
            >
              ← Back
            </button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-fg)]">
                <LockIcon />
                Secured by Square
              </div>
              <button
                type="button"
                onClick={handlePay}
                className="primary-button"
                disabled={sdkState !== "ready" || payState === "processing" || payState === "success"}
              >
                {payState === "processing" ? (
                  <span className="flex items-center gap-2"><Spinner small /> Processing…</span>
                ) : payState === "success" ? (
                  <span className="flex items-center gap-2">✓ Confirmed</span>
                ) : (
                  `Pay ${PACKAGE.priceLabel}`
                )}
              </button>
            </div>
          </div>
        </PaperSurface>
      </div>

      {/* Right: order summary */}
      <div className="space-y-6">
        <PaperSurface className="p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">
            Order summary
          </p>
          <div className="my-4"><GoldRule /></div>
          <p
            className="display text-2xl text-[var(--navy)]"
            style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          >
            {PACKAGE.name}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-fg)]">{PACKAGE.description}</p>
          <div className="my-4"><GoldRule /></div>
          <ul className="space-y-2.5">
            {[
              "184 individual policies",
              "7 fully indexed sections",
              "Named owner & approver fields",
              "Annual review cadence built in",
              "Single-practice PDF license",
              "Delivered to your email",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[var(--ink-soft)]">
                <span className="mt-[10px] h-px w-3 shrink-0 bg-[var(--gold)]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="my-4"><GoldRule /></div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted-fg)]">Total</span>
            <span
              className="display text-4xl text-[var(--navy)]"
              style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
            >
              {PACKAGE.priceLabel}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-[var(--muted-fg)]">
            One-time purchase · {PACKAGE.currency} · No subscription
          </p>
        </PaperSurface>

        {/* Security badges */}
        <PaperSurface className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted-fg)]">
            Security
          </p>
          <ul className="mt-3 space-y-2.5">
            {[
              "256-bit SSL encryption",
              "PCI-DSS compliant via Square",
              "Card data never touches Spark servers",
              "Tokenized payment — no card stored",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-xs leading-5 text-[var(--muted-fg)]">
                <span className="mt-[7px] h-px w-2.5 shrink-0 bg-[var(--gold)]" />
                {item}
              </li>
            ))}
          </ul>
        </PaperSurface>
      </div>
    </div>
  );
}

// ── Step 3: Confirmation ──────────────────────────────────────────────────────
function ConfirmationStep({
  paymentToken,
  onRestart,
}: {
  paymentToken: string | null;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <PaperSurface className="p-8 text-center md:p-12">
        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-4">
          <MiniStep n="01" label="Practice details" done />
          <div className="h-px w-10 bg-[var(--gold)]" />
          <MiniStep n="02" label="Payment" done />
          <div className="h-px w-10 bg-[var(--gold)]" />
          <MiniStep n="03" label="Confirmation" active />
        </div>

        {/* Checkmark */}
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[var(--gold)]">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-[var(--gold)] text-2xl text-[var(--gold)]">
            ✓
          </div>
        </div>

        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">
          Payment confirmed
        </p>
        <h2
          className="display mt-3 text-[clamp(2.25rem,4vw,3.5rem)] text-[var(--navy)]"
          style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
        >
          Your manual is on its{" "}
          <span className="gold-italic" style={{ fontStyle: "italic", color: "var(--gold)" }}>
            way.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[var(--muted-fg)]">
          A customized copy of the Spark Policy System will be delivered to{" "}
          <span className="font-semibold text-[var(--navy)]">{SAMPLE.buyerEmail}</span> once
          the production fulfillment workflow is connected.
        </p>

        <GoldRule />

        {/* Order recap */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
          <SummaryCell label="Practice" value={SAMPLE.practiceName} />
          <SummaryCell label="Department" value={SAMPLE.department} />
          <SummaryCell label="Amount charged" value={PACKAGE.priceLabel} />
          <SummaryCell
            label="Payment token"
            value={paymentToken ? `${paymentToken.slice(0, 12)}…` : "DEMO-TOKEN-XXXX"}
          />
        </div>

        {/* What happens next */}
        <div className="mt-8 border border-[var(--border)] bg-[#fdfbf6] p-6 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted-fg)]">
            What happens next
          </p>
          <ol className="mt-4 space-y-4">
            {[
              {
                n: "01",
                title: "Order confirmed",
                body: "Square processes your payment and sends a receipt to your email.",
              },
              {
                n: "02",
                title: "Manual customized",
                body: "Your practice name, department, and signer are applied to all 184 policies.",
              },
              {
                n: "03",
                title: "PDF delivered",
                body: "Your fully indexed, branded policy manual arrives by email within one business day.",
              },
            ].map((item) => (
              <li key={item.n} className="flex gap-4">
                <span
                  className="display shrink-0 text-2xl text-[var(--gold)]"
                  style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
                >
                  {item.n}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--navy)]">{item.title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-[var(--muted-fg)]">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Demo note */}
        <div className="mt-6 rounded border border-dashed border-[var(--gold)] bg-[#fdfbf6] p-4 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
            Demo note
          </p>
          <p className="mt-1.5 text-xs leading-5 text-[var(--muted-fg)]">
            In production, this screen triggers a Supabase order record update (
            <code className="rounded bg-[var(--border)] px-1 py-0.5 text-[10px]">status: paid</code>
            ) and kicks off the PDF generation and email delivery workflow.
          </p>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="secondary-button mt-8"
        >
          ← Restart demo
        </button>
      </PaperSurface>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function DemoStepHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">
        {eyebrow}
      </p>
      <h1
        className="display mt-2 text-[clamp(2rem,3.5vw,3rem)] text-[var(--navy)]"
        style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
      >
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted-fg)]">{subtitle}</p>
    </div>
  );
}

function DemoField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {multiline ? (
        <textarea
          className="field-input min-h-24 resize-none opacity-70"
          readOnly
          defaultValue={value}
          rows={3}
        />
      ) : (
        <input className="field-input opacity-70" readOnly defaultValue={value} />
      )}
    </label>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#fdfbf6] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">
        {label}
      </p>
      <p className="mt-1 truncate text-sm text-[var(--navy)]">{value}</p>
    </div>
  );
}

function MiniStep({
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
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="6" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
