import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getSiteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Workplace Policy | WowMindz Technologies",
  description:
    "WowMindz Technologies is a Coimbatore-based, remote-first technology company.",
};

const principles = [
  {
    title: "Remote-first by default",
    description:
      "Our work is designed to be completed remotely. We prioritize clear ownership, dependable communication and outcomes over a fixed office routine.",
  },
  {
    title: "Connected collaboration",
    description:
      "We keep teams aligned through intentional planning, documented decisions and regular check-ins that make distributed work practical and focused.",
  },
  {
    title: "Coimbatore-based",
    description:
      "WowMindz is based in Coimbatore, Tamil Nadu, India. Our team collaborates remotely while remaining connected to our local operating base.",
  },
];

export default async function WorkplacePolicyPage() {
  const config = await getSiteConfig();

  return (
    <div>
      <Nav />
      <PageHero
        eyebrow="How We Work"
        title="A remote-first way of working."
        description="WowMindz is based in Coimbatore and built to collaborate remotely. We create the structure, clarity and trust needed for focused work from wherever our team does its best work."
        ctaLabel="Talk to Us"
        ctaHref="/contact"
      />

      <main>
        <section className="section section-pattern">
          <div className="container grid grid-3">
            {principles.map((principle) => (
              <article className="card info-card" key={principle.title}>
                <p className="eyebrow">Workplace principle</p>
                <h2>{principle.title}</h2>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="container grid grid-2">
            <article className="card info-card">
              <p className="eyebrow">Our policy</p>
              <h2>Flexible location, clear standards.</h2>
              <p>
                We encourage remote work for our current team. Team members are expected to remain responsive during agreed collaboration windows, communicate progress early and protect the quality of their work.
              </p>
              <p>
                In-person meetings may be arranged when a project, workshop or client need benefits from being together. They are planned intentionally rather than treated as a default daily requirement.
              </p>
            </article>
            <article className="card info-card">
              <p className="eyebrow">Working together</p>
              <h2>Built for trust and momentum.</h2>
              <p>
                Our remote-first approach relies on shared goals, documented context and direct communication. We value thoughtful problem solving, accountability and respectful collaboration across every project.
              </p>
              <div className="divider" />
              <p>
                Questions about this policy or working with WowMindz? Reach us at{" "}
                <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>.
              </p>
              <Link className="button secondary" href="/services">
                Explore our services
              </Link>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
