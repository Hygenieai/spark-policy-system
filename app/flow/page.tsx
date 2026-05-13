import type { Metadata } from "next";
import FlowDemo from "@/components/flow/flow-demo";

export const metadata: Metadata = {
  title: "Spark Policy System — Payment Flow Demo",
  description: "Visual walkthrough of the Practice Details → Payment → Confirmation flow.",
  robots: { index: false, follow: false },
};

export default function FlowPage() {
  return <FlowDemo />;
}
