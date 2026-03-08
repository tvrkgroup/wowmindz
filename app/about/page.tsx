import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";
import { templatePageHeroes } from "@/content/page-content";
import { getSiteConfig } from "@/lib/site-config";
import InfoCardGrid from "@/components/sections/InfoCardGrid";

const aboutCards = [
  {
    title: "Who We Are",
    description:
      "WowMindz is built as a forward-looking brand that blends technology, business logic, and execution. It is not limited to one service line, but structured to grow into multiple products, ventures, and innovation-driven solutions over time.",
  },
  {
    title: "What We Do",
    description:
      "We work on digital products, IT solutions, startup concepts, and scalable system ideas. Our goal is to move beyond basic service work and build meaningful platforms with long-term value.",
  },
  {
    title: "How We Think",
    description:
      "We believe strong ideas should not remain ideas. They should be shaped, tested, improved, and turned into working systems. That is where WowMindz stands: involving, solving, and evolving.",
  },
  {
    title: "What We Aim To Build",
    description:
      "The long-term direction is to create a brand that can operate across multiple innovation areas, including software, venture ideas, digital tools, and future-facing platforms.",
  },
];

export default async function AboutPage() {
  await enforcePageVisibility("about");
  const config = await getSiteConfig();
  const hero = templatePageHeroes.about!;
  return (
    <div>
      <Nav />
      <PageHero
        title={`${hero.title} ${config.schoolNameShort}`}
        eyebrow={hero.eyebrow}
        description={hero.description}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
      />
      <section className="section">
        <div className="container">
          <InfoCardGrid items={aboutCards} columns={2} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
