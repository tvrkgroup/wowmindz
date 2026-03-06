import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import Link from "next/link";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function AcademicsPage() {
  await enforcePageVisibility("academics");
  return (
    <div>
      <Nav />
      <PageHero
        title="Academics Overview"
        eyebrow="Learning Pathways"
        description="An interdisciplinary curriculum that builds critical thinking, life skills, and academic strength from the foundation stage."
        ctaLabel="See Detailed Curriculum"
        ctaHref="/curriculum"
      />
      <section className="section">
        <div className="container grid grid-3">
          <div className="card info-card">
            <h3>Grades I–III</h3>
            <p>Core literacy, numeracy, and joyful exploration.</p>
          </div>
          <div className="card info-card">
            <h3>Grades IV–V</h3>
            <p>Conceptual learning with STEM labs and projects.</p>
          </div>
          <div className="card info-card">
            <h3>Grades VI–VII</h3>
            <p>Critical thinking, applied science, and exam readiness.</p>
          </div>
        </div>
        <div className="container">
          <div className="divider" />
          <Link href="/curriculum" className="button">
            Explore Curriculum Details
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
