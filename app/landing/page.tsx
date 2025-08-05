import { HeroSection } from '@/components/landing/hero-section';
import { ProblemSolutionSection } from '@/components/landing/problem-solution';
import { FeaturesGridSection } from '@/components/landing/features-grid';
import { AIAgentsShowcaseSection } from '@/components/landing/ai-agents-showcase';
import { SocialProofSection } from '@/components/landing/social-proof';
import { PricingTeaserSection } from '@/components/landing/pricing-teaser';
import { FooterSection } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesGridSection />
      <AIAgentsShowcaseSection />
      <SocialProofSection />
      <PricingTeaserSection />
      <FooterSection />
    </main>
  );
}