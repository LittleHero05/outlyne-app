import type { Metadata } from "next";
import { Suspense } from "react";
import { GenerateFlow } from "@/components/generate/generate-flow";

export const metadata: Metadata = {
  title: "Generate — Outlyne",
  description: "Choose an activity and create a shareable overlay card.",
};

export default function GeneratePage() {
  return (
    <Suspense fallback={null}>
      <GenerateFlow />
    </Suspense>
  );
}
