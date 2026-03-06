import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function GalleryPage() {
  await enforcePageVisibility("gallery");
  return (
    <div>
      <Nav />
      <PageHero
        title="Gallery"
        eyebrow="Campus Moments"
        description="Snapshots from classrooms, celebrations, and student showcases."
      />
      <section className="section">
        <div className="container grid grid-3">
          {[
            "/images/ai-campus-1.svg",
            "/images/ai-campus-2.svg",
            "/images/ai-campus-3.svg",
            "/images/ai-campus-4.svg",
            "/images/ai-campus-5.svg",
            "/images/ai-campus-6.svg",
          ].map((src, i) => (
            <div className="card info-card" key={src}>
              <img className="gallery-image" src={src} alt={`Campus view ${i + 1}`} />
              <p>Campus view #{i + 1}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
