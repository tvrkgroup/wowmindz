import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { enforcePageVisibility } from "@/lib/page-visibility";

const policies = [
  "Child protection policy",
  "Anti-bullying policy",
  "Health and safety policy",
  "Attendance policy",
  "Digital device policy",
  "Transport safety guidelines",
];

export default async function PoliciesPage() {
  await enforcePageVisibility("policies");
  return (
    <div>
      <Nav />
      <PageHero
        title="Policies"
        eyebrow="Student Safety"
        description="Clear guidelines that keep our community safe, respectful, and inclusive."
        ctaLabel="Download Policy Pack"
        ctaHref="/downloads"
      />
      <section className="section">
        <div className="container grid grid-3">
          {policies.map((policy) => (
            <div className="card info-card" key={policy}>
              <h3>{policy}</h3>
              <p>Updated annually with input from staff and parents.</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
