import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function CareersPage() {
  await enforcePageVisibility("careers");
  return (
    <div>
      <Nav />
      <PageHero
        title="Careers"
        eyebrow="Join Our Team"
        description="We welcome passionate educators and staff members to grow with our community."
        ctaLabel="Apply Now"
        ctaHref="/contact"
      />
      <section className="section">
        <div className="container grid grid-2">
          <div className="card info-card">
            <h3>Open Roles</h3>
            <p>Teaching, administration, and support positions listed annually.</p>
          </div>
          <div className="card info-card">
            <h3>How to Apply</h3>
            <p>Send your resume and cover letter to thesilverbrookpublicschool@gmail.com.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
