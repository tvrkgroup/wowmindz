import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import Link from "next/link";
import { enforcePageVisibility } from "@/lib/page-visibility";
import { templatePageHeroes } from "@/content/page-content";
import { getSiteConfig } from "@/lib/site-config";
import ProjectsShowcase from "@/components/projects/ProjectsShowcase";

export default async function ProjectsPage() {
  await enforcePageVisibility("academics");
  const config = await getSiteConfig();
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
          <ProjectsShowcase projects={config.projects || []} />
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
