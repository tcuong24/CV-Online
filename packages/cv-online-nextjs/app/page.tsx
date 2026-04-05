import { CTASection } from "@/components/home/CTASection";
import { FeaturesSection } from "@/components/home/FeatureSection";
import { HeroSection } from "@/components/home/HeroSection";
import { TemplatesSection } from "@/components/home/TemplateSection";
import Header from "@/components/layout/header";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5">
            <div className="layout-content-container flex w-full max-w-7xl flex-1 flex-col px-4 md:px-6">
              <main>
                <HeroSection />
                <FeaturesSection />
                <TemplatesSection />
                <CTASection />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
