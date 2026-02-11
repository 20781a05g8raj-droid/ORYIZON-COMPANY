import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { WhyChooseSection } from '@/components/home/WhyChooseSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { FeaturedProduct } from '@/components/home/FeaturedProduct';
import { HowToUseSection } from '@/components/home/HowToUseSection';
import { AEODirectAnswers } from '@/components/home/AEODirectAnswers';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { FAQPreviewSection } from '@/components/home/FAQPreviewSection';
import { CTASection } from '@/components/home/CTASection';
import { StructuredData } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Organic Moringa Powder for Daily Health & Immunity | Oryizon',
  description: 'Premium organic moringa powder rich in vitamins, minerals & antioxidants. Boost immunity, energy & overall wellness naturally with Oryizon.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <HeroSection />
      <WhyChooseSection />
      <BenefitsSection />
      <FeaturedProduct />
      <HowToUseSection />
      <AEODirectAnswers />
      <TestimonialsSection />
      <BrandStorySection />
      <FAQPreviewSection />
      <CTASection />
    </>
  );
}
