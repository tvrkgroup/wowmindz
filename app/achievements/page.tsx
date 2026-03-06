import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

const milestones = [
  "Founding faculty onboarded",
  "STEM labs and smart classrooms commissioned",
  "Safety policies and student care systems established",
  "Admissions opened for Grades I–VII",
  "Transport network planned for surrounding areas",
  "Campus inauguration planned for 2026",
];

export default async function AchievementsPage() {
  await enforcePageVisibility("achievements");
  return (
    <div>
      <Nav />
      <PageHero
        title="Early Milestones"
        eyebrow="Launching 2026–27"
        description="As a new school, we are building strong foundations that will lead to future achievements."
        ctaLabel="Explore News"
        ctaHref="/news"
      />
      <section className="section">
        <div className="container grid grid-3">
          {milestones.map((item) => (
            <div className="card info-card" key={item}>
              <h3>{item}</h3>
              <p>Progress toward a safe, modern, and joyful learning campus.</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
