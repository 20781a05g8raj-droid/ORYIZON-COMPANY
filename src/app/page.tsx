import { HeroSection } from '@/components/home/HeroSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { FeaturedProduct } from '@/components/home/FeaturedProduct';
import { HowToUseSection } from '@/components/home/HowToUseSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { FAQPreviewSection } from '@/components/home/FAQPreviewSection';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturedProduct />
      <HowToUseSection />
      <TestimonialsSection />
      <BrandStorySection />
      <FAQPreviewSection />
      <CTASection />
    </>
  );
}
