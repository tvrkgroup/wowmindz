import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

const docs = [
  "Admission Form",
  "Prospectus 2026-27",
  "Fee Structure",
  "Transport Routes",
  "School Calendar",
  "Policy Handbook",
];

export default async function DownloadsPage() {
  await enforcePageVisibility("downloads");
  return (
    <div>
      <Nav />
      <PageHero
        title="Downloads"
        eyebrow="Resources"
        description="Forms, prospectus, and key documents for families."
      />
      <section className="section">
        <div className="container grid grid-3">
          {docs.map((doc) => (
            <div className="card info-card" key={doc}>
              <h3>{doc}</h3>
              <p>PDF file placeholder — upload the final document.</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
