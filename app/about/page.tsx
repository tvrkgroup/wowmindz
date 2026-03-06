import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function AboutPage() {
  await enforcePageVisibility("about");
  return (
    <div>
      <Nav />
      <PageHero
        title="About The Silver Brook"
        eyebrow="Our Story"
        description="A forward-thinking school in Karatoor, near Gobichettipalayam, focused on shaping confident, future-ready leaders."
        ctaLabel="Meet the Faculty"
        ctaHref="/faculty"
      />
      <section className="section">
        <div className="container grid grid-2">
          <div className="card info-card">
            <h3>Vision</h3>
            <p>To shape confident leaders who believe they can change the world.</p>
          </div>
          <div className="card info-card">
            <h3>Mission</h3>
            <p>
              To deliver rigorous, tech-enabled learning with strong values and
              holistic development.
            </p>
          </div>
          <div className="card info-card">
            <h3>Philosophy</h3>
            <p>Learning is the Key to Leadership.</p>
          </div>
          <div className="card info-card">
            <h3>What makes us different</h3>
            <p>
              Interdisciplinary learning, STEM focus, and a safe, vibrant campus
              culture built from the ground up.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
