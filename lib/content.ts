/*
  Design philosophy: Editorial Institutional Modernism.
  Content is isolated here so the standalone MVP can later migrate into the Spark website
  as a route-level content module without rewriting the landing page sections.
*/

export type ValueProp = {
  n: string;
  title: string;
  body: string;
};

export type IncludedSection = {
  label: string;
  title: string;
  items: string[];
};

export type HowItWorksStep = {
  n: string;
  title: string;
  body: string;
};

export const navLinks = [
  { href: "#value", label: "Why" },
  { href: "#included", label: "What's included" },
  { href: "#sample", label: "Sample" },
  { href: "#how", label: "How it works" },
] as const;

export const valueProps: ValueProp[] = [
  {
    n: "01",
    title: "Standardized policies",
    body: "A consistent voice and structure across every policy in the practice — written once, owned forever.",
  },
  {
    n: "02",
    title: "Clear ownership",
    body: "Every procedure has a named owner, signer, and review cadence. No more confusion about who approves what.",
  },
  {
    n: "03",
    title: "Cross-department consistency",
    body: "Front desk, clinical, billing, and HR operate from the same playbook with the same standards.",
  },
  {
    n: "04",
    title: "Weeks of work, delivered",
    body: "Replace months of internal drafting with a polished, ready-to-customize manual delivered as a single PDF.",
  },
];

export const sections: IncludedSection[] = [
  {
    label: "I",
    title: "Administrative",
    items: ["Practice governance", "Office hours & scheduling", "Communications standards", "Vendor management"],
  },
  {
    label: "II",
    title: "Clinical Operations",
    items: ["Patient intake protocol", "Procedure room turnover", "Specimen handling", "Clinical documentation"],
  },
  {
    label: "III",
    title: "Billing & Revenue Cycle",
    items: ["Coding standards", "Claim submission", "Denials workflow", "Patient collections"],
  },
  {
    label: "IV",
    title: "HR & Team Workflows",
    items: ["Onboarding & credentialing", "Time & attendance", "Performance reviews", "Termination protocol"],
  },
  {
    label: "V",
    title: "Compliance",
    items: ["HIPAA safeguards", "OSHA standards", "Incident reporting", "Annual training calendar"],
  },
  {
    label: "VI",
    title: "Patient Experience",
    items: ["Front desk standards", "Complaint resolution", "Wait-time protocol", "Post-visit follow-up"],
  },
  {
    label: "VII",
    title: "Documentation Standards",
    items: ["Chart note formatting", "Consent forms", "Records retention", "Release of information"],
  },
];

export const steps: HowItWorksStep[] = [
  {
    n: "01",
    title: "Purchase the package",
    body: "Secure a single-license edition of the Spark Policy System for your practice.",
  },
  {
    n: "02",
    title: "Complete a short intake",
    body: "Tell us your practice name, department, and signing authority. Five fields, two minutes.",
  },
  {
    n: "03",
    title: "Receive your manual",
    body: "Your customized PDF arrives by email — fully indexed, branded, and ready to deploy.",
  },
];

export const heroImageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663324085336/5ZkV4rMCQpxyzzFGRR3eK6/spark-policy-hero-physician-hq4LnAsNGep6dUFdsJuMhe.webp";
export const manualImageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663324085336/5ZkV4rMCQpxyzzFGRR3eK6/spark-policy-manual-stack-2WqYG3UwNZS639gm68Zwd2.webp";
export const paperTextureUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663324085336/5ZkV4rMCQpxyzzFGRR3eK6/spark-policy-paper-texture-mDpQqEqY2vgUpRKo3NXsdr.webp";
