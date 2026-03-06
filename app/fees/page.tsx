import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function FeesPage() {
  await enforcePageVisibility("fees");
  return (
    <div>
      <Nav />
      <PageHero
        title="Fees & Scholarships"
        eyebrow="Affordability"
        description="Transparent fee structure with scholarship guidance for deserving students."
        ctaLabel="Download Fee Sheet"
        ctaHref="/downloads"
      />
      <section className="section">
        <div className="container grid grid-3">
          <div className="card info-card">
            <h3>Primary School</h3>
            <p>Annual tuition and activity fees. Contact admissions for details.</p>
          </div>
          <div className="card info-card">
            <h3>Middle School</h3>
            <p>Includes lab, library, and co-curricular support.</p>
          </div>
          <div className="card info-card">
            <h3>Senior School</h3>
            <p>Subject-specific lab access and exam guidance support.</p>
          </div>
        </div>
        <div className="divider" />
        <div className="container">
          <h3>Scholarships</h3>
          <p>
            Merit-based and need-based scholarships are available. Speak to the
            admissions team for eligibility criteria.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
