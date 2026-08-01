import type { Metadata } from "next";
import { GenerateFlow } from "@/components/generate/generate-flow";

export const metadata: Metadata = {
  title: "Generate — Outlyne",
  description: "Choose an activity and create a shareable overlay card.",
};

export default function GeneratePage() {
  return <GenerateFlow />;
}
