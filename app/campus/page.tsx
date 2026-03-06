import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import Link from "next/link";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function CampusPage() {
  await enforcePageVisibility("campus");
  return (
    <div>
      <Nav />
      <PageHero
        title="Campus & Facilities"
        eyebrow="Our Spaces"
        description="Modern facilities that support technology-enabled learning, safety, and well-being."
        ctaLabel="See Gallery"
        ctaHref="/gallery"
      />
      <section className="section">
        <div className="container grid grid-3">
          <div className="card info-card">
            <span className="icon-badge" aria-hidden="true">SC</span>
            <h3>Smart Classrooms</h3>
            <p>Interactive boards, flexible seating, and digital resources.</p>
          </div>
          <div className="card info-card">
            <span className="icon-badge" aria-hidden="true">ST</span>
            <h3>STEM Labs</h3>
            <p>Robotics, coding, and science labs for hands-on learning.</p>
          </div>
          <div className="card info-card">
            <span className="icon-badge" aria-hidden="true">LC</span>
            <h3>Learning Commons</h3>
            <p>Reading spaces and curated resources for every grade.</p>
          </div>
          <div className="card info-card">
            <span className="icon-badge" aria-hidden="true">SA</span>
            <h3>Sports Arena</h3>
            <p>Outdoor fields, indoor courts, and wellness studios.</p>
          </div>
          <div className="card info-card">
            <span className="icon-badge" aria-hidden="true">AR</span>
            <h3>Arts Studios</h3>
            <p>Dedicated spaces for music, dance, and visual arts.</p>
          </div>
          <div className="card info-card">
            <span className="icon-badge" aria-hidden="true">SF</span>
            <h3>Safe Campus</h3>
            <p>Professional staff, security systems, and clear safety policies.</p>
          </div>
        </div>
        <div className="container">
          <div className="divider" />
          <Link href="/transport" className="button secondary">
            Transport Details
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
