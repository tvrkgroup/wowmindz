import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function CurriculumPage() {
  await enforcePageVisibility("curriculum");
  return (
    <div>
      <Nav />
      <PageHero
        title="Curriculum"
        eyebrow="Academic Framework"
        description="A technology-integrated, interdisciplinary curriculum that builds problem-solving, communication, and future-ready skills."
        ctaLabel="Download Curriculum"
        ctaHref="/downloads"
      />
      <section className="section">
        <div className="container grid grid-2">
          <div className="card info-card">
            <h3>Core Subjects</h3>
            <p>
              Languages, Mathematics, Science, Social Studies, and ICT aligned
              with strong academic standards.
            </p>
          </div>
          <div className="card info-card">
            <h3>STEM & Innovation</h3>
            <p>
              Robotics, coding, and maker projects that connect theory to real
              application.
            </p>
          </div>
          <div className="card info-card">
            <h3>Life Skills</h3>
            <p>
              Communication, collaboration, leadership, and personal growth
              embedded across subjects.
            </p>
          </div>
          <div className="card info-card">
            <h3>Academic Readiness</h3>
            <p>
              Strong foundations for competitive exams such as NEET, IIT, and JEE
              as students progress.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
