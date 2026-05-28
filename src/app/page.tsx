import { Header } from "@/components/ui/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PreviewSection } from "@/components/landing/PreviewSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PreviewSection />
      <CTASection />
    </main>
  );
}
