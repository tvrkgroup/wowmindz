import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import Link from "next/link";
import { enforcePageVisibility } from "@/lib/page-visibility";
import { templatePageHeroes } from "@/content/page-content";
import InfoCardGrid from "@/components/sections/InfoCardGrid";

const projectCards = [
  {
    title: "ktvr.in",
    description: "Core platform and execution stream.",
  },
  {
    title: "prathipa.com",
    description: "Brand and product web presence.",
  },
  {
    title: "wowmyspace.com",
    description: "Digital ecosystem initiative.",
  },
  {
    title: "thrivikram.com",
    description: "Personal brand and public profile.",
  },
  {
    title: "TiGR Election Code",
    description: "Election-related implementation project.",
  },
  {
    title: "Collaborative: nutopia.in",
    description: "Collaborative partnership build.",
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
