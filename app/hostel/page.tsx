import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function HostelPage() {
  await enforcePageVisibility("hostel");
  return (
    <div>
      <Nav />
      <PageHero
        title="Hostel"
        eyebrow="Residential Life"
        description="Comfortable, supervised hostel facilities for students who need residential support."
      />
      <section className="section">
        <div className="container grid grid-2">
          <div className="card info-card">
            <h3>Facilities</h3>
            <p>Well-ventilated rooms, study halls, and nutritious meals.</p>
          </div>
          <div className="card info-card">
            <h3>Student Care</h3>
            <p>House parents, wellness checks, and structured routines.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
