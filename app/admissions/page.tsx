import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import Link from "next/link";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function AdmissionsPage() {
  await enforcePageVisibility("admissions");
  return (
    <div>
      <Nav />
      <PageHero
        title="Admissions"
        eyebrow="Join the Founding Batches"
        description="Admissions are open for Grades I to VII for the 2026–27 academic year."
        ctaLabel="Fees & Scholarships"
        ctaHref="/fees"
      />
      <section className="section section-pattern">
        <div className="container grid grid-2">
          <div className="card info-card">
            <h3>Admissions Process</h3>
            <ul className="list">
              <li>Submit enquiry form</li>
              <li>Campus visit and interaction</li>
              <li>Document verification</li>
              <li>Confirmation and orientation</li>
            </ul>
          </div>
          <div className="card info-card">
            <h3>Required Documents</h3>
            <ul className="list">
              <li>Birth certificate</li>
              <li>Previous school records</li>
              <li>Transfer certificate (if applicable)</li>
              <li>Address proof</li>
            </ul>
          </div>
        </div>
        <div className="container">
          <div className="divider" />
          <Link href="/contact" className="button">
            Schedule a Visit
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
