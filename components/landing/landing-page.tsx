"use client";

/*
  Design philosophy: Editorial Institutional Modernism.
  This page uses asymmetric editorial spreads, ivory paper surfaces, navy authority,
  restrained gold rules, and quiet form interactions to frame the MVP as a premium
  physician-practice policy system rather than a generic SaaS page.
*/

import Image from "next/image";
import { useState } from "react";
import { heroImageUrl, manualImageUrl, navLinks, paperTextureUrl, sections, steps, valueProps } from "@/lib/content";
import { Eyebrow, Field, GoldRule, PaperSurface, SectionHeading } from "./primitives";

type IntakeFormValues = {
  practiceName: string;
  department: string;
  ownerName: string;
  buyerEmail: string;
  notes: string;
};

const initialValues: IntakeFormValues = {
  practiceName: "",
  department: "",
  ownerName: "",
  buyerEmail: "",
  notes: "",
};

export default function LandingPage() {
  const [values, setValues] = useState<IntakeFormValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  function updateValue(field: keyof IntakeFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function resetFlow() {
    setSubmitted(false);
    setValues(initialValues);
    window.setTimeout(() => document.getElementById("top")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  return (
    <div id="top" className="site-shell">
      <Header />
      <main>
        <Hero />
        <ValueSection />
        <IncludedSection />
        <SamplePolicySection />
        <HowItWorksSection />
        <IntakeSection values={values} submitted={submitted} onChange={updateValue} onSubmit={handleSubmit} onReset={resetFlow} />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="nav-glass">
      <div className="container flex h-full items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-3" aria-label="Spark Policy System home">
          <span className="relative grid h-9 w-9 place-items-center bg-[var(--navy)] text-[var(--gold)] shadow-sm">
            <span className="absolute inset-1 border border-[var(--gold)]/70" />
            <span className="display relative text-xl">S</span>
          </span>
          <span className="display text-2xl tracking-[-0.03em] text-[var(--navy)]">
            Spark <span className="gold-italic">Policy</span> System
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-fg)] transition hover:text-[var(--navy)]">
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#intake" className="primary-button hidden sm:inline-flex">Get the package</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-20 lg:pb-32 lg:pt-28">
      <div className="absolute inset-x-0 top-0 h-full opacity-35" style={{ backgroundImage: `url(${paperTextureUrl})`, backgroundSize: "cover", backgroundPosition: "center top" }} aria-hidden="true" />
      <div className="container relative grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <Eyebrow>Edition One — Dermatology</Eyebrow>
          <h1 className="display mt-7 max-w-4xl text-[clamp(3rem,6vw,5.25rem)] text-[var(--navy)]">
            A complete policy<br />and procedure <span className="gold-italic">system</span><br />for physician practices.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted-fg)]">
            Standardize operations, clarify ownership, and install a polished policy structure your team can actually use. Built as a premium, ready-to-customize manual for modern physician practices.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#intake" className="primary-button">Get the Policy Package</a>
            <a href="#sample" className="secondary-button">View Sample Manual</a>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-fg)]">
            {['One-time purchase', 'Delivered as PDF', 'Customized to your practice'].map((item, index) => (
              <span key={item} className={index === 0 ? "" : "border-l border-[var(--border)] pl-4"}>{item}</span>
            ))}
          </div>
        </div>
        <div className="relative lg:pl-6">
          <div className="absolute -left-3 -top-5 bottom-10 right-12 hidden border border-[var(--gold)]/45 lg:block" aria-hidden="true" />
          <PaperSurface className="relative overflow-hidden rounded-sm p-3">
            <Image src={heroImageUrl} alt="Physician and practice manager reviewing a policy manual" width={1408} height={1056} priority sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] w-full object-cover" />
          </PaperSurface>
          <div className="paper absolute -bottom-8 right-6 hidden w-72 p-6 lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">Edition I</p>
            <p className="display mt-2 text-3xl text-[var(--navy)]">Policy & Procedure</p>
            <div className="my-4"><GoldRule /></div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-fg)]">184 policies · 7 sections · single PDF</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueSection() {
  return (
    <section id="value" className="section-pad">
      <div className="container">
        <SectionHeading eyebrow="Why It Matters" title="Why practices use a system like this." italic="system" intro="A strong policy manual is not just documentation. It is operational infrastructure for how the practice makes decisions, trains staff, and protects consistency." />
        <div className="grid-divider mt-14 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((item) => (
            <article key={item.n} className="min-h-72 p-8 transition hover:bg-[#fbf7ee]">
              <p className="display text-5xl text-[var(--gold)]">{item.n}</p>
              <h3 className="display mt-10 text-3xl text-[var(--navy)]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-fg)]">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IncludedSection() {
  return (
    <section id="included" className="section-pad bg-[rgba(234,228,214,0.45)]">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Table of Contents" title="What’s included in the manual." italic="included" />
          <p className="max-w-sm text-[11px] font-semibold uppercase leading-6 tracking-[0.2em] text-[var(--muted-fg)]">Seven sections · 184 individual policies · fully indexed and cross-referenced</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <PaperSurface key={section.label} className="p-7 transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(42,58,94,0.18)]">
              <div className="flex items-start justify-between gap-5">
                <p className="display text-5xl text-[var(--gold)]">{section.label}</p>
                <p className="pt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted-fg)]">Section</p>
              </div>
              <h3 className="display mt-7 text-3xl text-[var(--navy)]">{section.title}</h3>
              <div className="my-5"><GoldRule /></div>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--ink-soft)]"><span className="mt-3 h-px w-3 shrink-0 bg-[var(--gold)]" />{item}</li>
                ))}
              </ul>
            </PaperSurface>
          ))}
        </div>
      </div>
    </section>
  );
}

function SamplePolicySection() {
  return (
    <section id="sample" className="section-pad">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <SectionHeading eyebrow="Sample Page" title="A sample policy page." italic="sample" intro="The manual is designed to feel deployable: each policy has an owner, approver, review cycle, and clear procedural steps." />
          <a href="#intake" className="mt-8 inline-block border-b border-[var(--gold)] pb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--navy)]">Get the full manual</a>
          <PaperSurface className="mt-10 overflow-hidden p-2">
            <Image src={manualImageUrl} alt="Stacked policy manual and practice operations documents" width={1408} height={1056} sizes="(min-width: 1024px) 28vw, 100vw" className="aspect-[4/3] w-full object-cover" />
          </PaperSurface>
        </div>
        <div className="lg:col-span-8">
          <PaperSurface className="overflow-hidden p-8 md:p-12 lg:p-14">
            <div className="h-1 bg-[var(--navy)]" /><div className="h-px bg-[var(--gold)]" />
            <div className="mt-8 flex flex-wrap justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted-fg)]"><span>Spark Policy System · Edition I</span><span>Section II.04</span></div>
            <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">Clinical Operations</p>
            <h3 className="display mt-3 text-[clamp(2rem,4vw,3.6rem)] text-[var(--navy)]">Specimen Handling & Chain of Custody.</h3>
            <div className="my-8"><GoldRule /></div>
            <div className="grid gap-px bg-[var(--border)] md:grid-cols-2">
              {[
                ["Purpose", "Protect specimen integrity from collection through transfer."],
                ["Scope", "Clinical team, front desk, and approved courier partners."],
                ["Owner", "Clinical Operations Lead"],
                ["Approver", "Medical Director"],
                ["Effective Date", "Upon practice customization"],
                ["Review Cycle", "Annual"],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#fdfbf6] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">{label}</p><p className="mt-2 text-sm leading-6 text-[var(--navy)]">{value}</p></div>
              ))}
            </div>
            <div className="my-9"><GoldRule /></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted-fg)]">Procedure</p>
            <ol className="mt-5 space-y-4 font-mono text-sm leading-7 text-[var(--navy)]">
              {[
                "Verify patient identity using two approved identifiers prior to specimen collection.",
                "Label every container at the point of collection in the presence of the patient.",
                "Complete the specimen log with collector initials, date, and time of collection.",
                "Transfer to the designated holding area within fifteen minutes of collection.",
                "Confirm courier pickup against the daily manifest and obtain signature on transfer.",
              ].map((line, index) => <li key={line}>{`${index + 1}.0 ${line}`}</li>)}
            </ol>
            <div className="my-9"><GoldRule /></div>
            <div className="grid gap-8 md:grid-cols-2"><Signature label="Department Owner — Signature" /><Signature label="Approver — Signature & Date" /></div>
            <div className="mt-10 flex justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted-fg)]"><span>spark policy system</span><span>page 47 of 312</span></div>
          </PaperSurface>
        </div>
      </div>
    </section>
  );
}

function Signature({ label }: { label: string }) {
  return <div><div className="h-px bg-[var(--navy)]/35" /><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted-fg)]">{label}</p></div>;
}

function HowItWorksSection() {
  return (
    <section id="how" className="section-pad bg-[var(--slate-blue)] text-white">
      <div className="container">
        <div className="max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">How It Works</p><h2 className="display mt-5 text-[clamp(2.25rem,4.2vw,3.75rem)]">From purchase to practice-ready manual.</h2></div>
        <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.n} className="bg-[var(--slate-blue)] p-8 md:p-10"><div className="grid h-14 w-14 place-items-center rounded-full border border-[var(--gold)] text-[var(--gold)]"><span className="display text-2xl">{step.n}</span></div><h3 className="display mt-10 text-3xl">{step.title}</h3><p className="mt-4 text-sm leading-7 text-white/80">{step.body}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntakeSection({ values, submitted, onChange, onSubmit, onReset }: { values: IntakeFormValues; submitted: boolean; onChange: (field: keyof IntakeFormValues, value: string) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; onReset: () => void; }) {
  return (
    <section id="intake" className="section-pad">
      <div className="container">
        {!submitted ? (
          <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="Begin" title="Customize your manual." italic="your manual" intro="Tell us where the first edition should be pointed. This MVP form is a visual walkthrough only; the production version would connect to Supabase and Square." align="center" />
            <PaperSurface className="mt-12 p-7 md:p-10">
              <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-2">
                <Field label="Practice name" required><input className="field-input" required value={values.practiceName} onChange={(event) => onChange("practiceName", event.target.value)} /></Field>
                <Field label="Department" required><input className="field-input" required value={values.department} onChange={(event) => onChange("department", event.target.value)} /></Field>
                <Field label="Department owner / signer" required><input className="field-input" required value={values.ownerName} onChange={(event) => onChange("ownerName", event.target.value)} /></Field>
                <Field label="Buyer email" required><input className="field-input" required type="email" value={values.buyerEmail} onChange={(event) => onChange("buyerEmail", event.target.value)} /></Field>
                <div className="md:col-span-2"><Field label="Optional notes"><textarea className="field-input min-h-28 resize-y" rows={4} value={values.notes} onChange={(event) => onChange("notes", event.target.value)} /></Field></div>
                <div className="flex flex-col gap-5 border-t border-[var(--border)] pt-7 md:col-span-2 md:flex-row md:items-center md:justify-between">
                  <p className="max-w-lg text-xs leading-6 text-[var(--muted-fg)]">This product is not legal advice. It is a document system for operational use and does not collect PHI in this MVP form.</p>
                  <button className="primary-button" type="submit">Submit and Generate Manual</button>
                </div>
              </form>
            </PaperSurface>
          </div>
        ) : (
          <PaperSurface className="mx-auto max-w-2xl p-8 text-center md:p-12">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[var(--gold)]"><div className="grid h-11 w-11 place-items-center rounded-full border border-[var(--gold)] text-2xl text-[var(--gold)]">✓</div></div>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">Confirmed</p>
            <h2 className="display mt-3 text-[clamp(2.25rem,4vw,3.75rem)] text-[var(--navy)]">Your request has been <span className="gold-italic">received.</span></h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[var(--muted-fg)]">The customized manual preview request would be sent to <span className="font-semibold text-[var(--navy)]">{values.buyerEmail || "your email"}</span> once the production workflow is connected.</p>
            <div className="mt-9 border border-[var(--border)] bg-[#fdfbf6] p-6 text-left"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted-fg)]">What happens next</p><div className="mt-5 space-y-4">{["Supabase stores the intake request.", "Square confirms purchase status.", "The manual generation workflow prepares the PDF."].map((item, index) => <p key={item} className="flex gap-4 text-sm text-[var(--navy)]"><span className="display text-2xl text-[var(--gold)]">0{index + 1}</span>{item}</p>)}</div></div>
            <button type="button" onClick={onReset} className="secondary-button mt-8">Return to site</button>
          </PaperSurface>
        )}
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="bg-[rgba(234,228,214,0.50)] py-24 text-center">
      <div className="container"><SectionHeading eyebrow="A One-Time Purchase" title="Install a polished policy structure in a single afternoon." italic="single afternoon" align="center" /><a href="#intake" className="primary-button mt-9">Begin the intake</a></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="container flex flex-col justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.20em] text-[var(--muted-fg)] md:flex-row"><p>Spark Policy System · Edition I, Dermatology</p><p>© {new Date().getFullYear()} Spark. Operational document system; not legal advice.</p></div>
    </footer>
  );
}
