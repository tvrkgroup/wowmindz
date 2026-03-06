import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function TransportPage() {
  await enforcePageVisibility("transport");
  return (
    <div>
      <Nav />
      <PageHero
        title="Transport"
        eyebrow="Safe Commute"
        description="Planned GPS-enabled school buses with trained staff for student safety."
      />
      <section className="section">
        <div className="container grid grid-2">
          <div className="card info-card">
            <h3>Routes</h3>
            <p>
              Buses will operate across Gobichettipalayam and surrounding areas.
              Final routes will be announced before opening.
            </p>
          </div>
          <div className="card info-card">
            <h3>Safety</h3>
            <p>
              Dedicated transport coordinators, GPS tracking, and trained
              attendants on each route.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
