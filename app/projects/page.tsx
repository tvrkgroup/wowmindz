import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import Link from "next/link";
import { enforcePageVisibility } from "@/lib/page-visibility";
import { templatePageHeroes } from "@/content/page-content";
import InfoCardGrid from "@/components/sections/InfoCardGrid";

const projectCards = [
  {
    title: "Digital Products",
    description: "Custom digital solutions for modern business and product needs.",
  },
  {
    title: "Scalable Systems",
    description: "Architecture and implementation built for long-term growth.",
  },
  {
    title: "Innovation Tracks",
    description: "Startup ideas and future-facing concepts shaped into practical experiments.",
  },
];

export default async function ProjectsPage() {
  await enforcePageVisibility("academics");
  const hero = templatePageHeroes.academics!;

  return (
    <div>
      <Nav />
      <PageHero
        title={hero.title}
        eyebrow={hero.eyebrow}
        description={hero.description}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
      />
      <section className="section">
        <div className="container">
          <InfoCardGrid items={projectCards} />
        </div>
        <div className="container">
          <div className="divider" />
          <Link href="/contact" className="button">
            Start a Project Conversation
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
