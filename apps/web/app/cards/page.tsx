import type { Metadata } from "next";
import { MyCards } from "@/components/cards/my-cards";
import { GenerateHeader } from "@/components/generate/generate-header";

export const metadata: Metadata = {
  title: "My cards — Outlyne",
  description: "Your saved Outlyne cards.",
  robots: { index: false },
};

export default function CardsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-outlyne-blue">
      <GenerateHeader current="cards" />
      <main className="flex-1">
        <MyCards />
      </main>
    </div>
  );
}
