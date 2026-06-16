import { CtaSection } from "@/components/marketing/cta-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { ShowcaseSection } from "@/components/marketing/showcase-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ShowcaseSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
