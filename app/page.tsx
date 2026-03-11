import Link from "next/link";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { getSiteConfig } from "@/lib/site-config";
import { enforcePageVisibility } from "@/lib/page-visibility";
import {
  homeAcademicExams,
  homeHeroContent,
  homeKeyBenefits,
  homeSpecialFeatures,
  homeStudentLife,
} from "@/content/home-content";
import { getTemplateSiteIdentity } from "@/config/template-config";

function formatPhoneForHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export default async function Home() {
  await enforcePageVisibility("home");
  const config = await getSiteConfig();
  const site = getTemplateSiteIdentity(config);

  return (
    <div>
      <Nav />

      <section className="section home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-left">
            <p className="eyebrow home-hero-eyebrow">{homeHeroContent.eyebrow}</p>
            <h1 className="home-gradient-title">{site.tagline}</h1>
            <p className="home-subline">{homeHeroContent.subline}</p>
            <div className="home-vision-block">
              <p>
                <strong>Vision:</strong> {homeHeroContent.vision}
              </p>
              <p>
                <strong>Mission:</strong> {homeHeroContent.mission}
              </p>
            </div>
            <div className="home-badges">
              {homeHeroContent.badges.map((badge) => (
                <span key={badge} className="home-badge">
                  {badge}
                </span>
              ))}
            </div>
            <div className="home-actions">
              <Link href="/projects" className="button">
                Explore Our Work
              </Link>
              <Link href="/contact" className="button secondary">
                Contact Us
              </Link>
            </div>
          </div>

          <aside className="home-hero-right card">
            <h3>WowMindz Technologies</h3>
            <p>Building at the intersection of technology, execution, and future-ready thinking.</p>
            <div className="divider" />
            <p>
              From digital platforms to venture ideas, WowMindz is designed to explore, test, and build what matters
              next.
            </p>
            <p>Contact: {site.phone}</p>
            <div className="home-stats">
              <div>
                <strong>Build</strong>
                <span>Products</span>
              </div>
              <div>
                <strong>Scale</strong>
                <span>Systems</span>
              </div>
              <div>
                <strong>Launch</strong>
                <span>Ideas</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section accent home-section section-pattern">
        <div className="container">
          <h2>Special Features</h2>
          <div className="home-cards-grid">
            {homeSpecialFeatures.map((item) => (
              <article className="card home-feature-card home-theme-card" key={item.title}>
                <span className="home-dot" aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-section section-pattern">
        <div className="container">
          <h2>Key Benefits</h2>
          <div className="home-benefits-grid">
            {homeKeyBenefits.map((item) => (
              <article className="card home-benefit-card home-theme-card" key={item.title}>
                <h3>{item.title}</h3>
                <ul className="home-mini-list">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="card home-contact-card home-theme-card">
            <div className="info-row">
              <span className="icon icon-phone" aria-hidden="true" />
              <a href={`tel:${formatPhoneForHref(site.phone)}`}>
                <strong>Call Us:</strong> {site.phone}
              </a>
            </div>
            <div className="info-row">
              <span className="icon icon-mail" aria-hidden="true" />
              <a href={`mailto:${site.email}`}>
                <strong>Email:</strong> {site.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section accent home-section section-pattern">
        <div className="container">
          <article className="card home-cbse-card home-theme-card">
            <div className="home-cbse-layout">
              <div className="home-cbse-logo-wrap">
                <img className="home-cbse-logo" src={config.logoPath || "/logo.png"} alt={`${config.schoolName} logo`} />
              </div>
              <div className="home-cbse-content">
                <h2>{site.siteName}</h2>
                <p>Involve. Solve. Evolve.</p>
                <p>Technology studio for digital products and scalable systems.</p>
                <p>Contact: {site.phone}</p>
                <div className="divider" />
                <p>
                  <strong>MODERN EXECUTION</strong>
                </p>
                <p>Product-first thinking with business logic.</p>
                <p>Built for long-term value creation.</p>
                <p>
                  <strong>Explore Our Work</strong>
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section home-section">
        <div className="container">
          <h2>{homeAcademicExams.title}</h2>
          <div className="home-exams-grid">
            <article className="card home-exam-card home-theme-card">
              <h3>Product & Platform</h3>
              <ol className="home-ordered-list">
                {homeAcademicExams.olympiad.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>

            <article className="card home-exam-card home-theme-card">
              <h3>System & Solution</h3>
              <ol className="home-ordered-list">
                {homeAcademicExams.national.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>

            <article className="card home-exam-card home-theme-card">
              <h3>Innovation & Venture</h3>
              <ol className="home-ordered-list">
                {homeAcademicExams.other.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          </div>
          <article className="card home-note-card home-theme-card">
            <p>
              <strong>Note:</strong> Every initiative is shaped for practical impact, operational clarity, and future
              scalability.
            </p>
          </article>
        </div>
      </section>

      <section className="section accent home-section section-pattern">
        <div className="container">
          <div className="home-group-head">
            <h2>{homeStudentLife.title}</h2>
            <p>{homeStudentLife.subtitle}</p>
          </div>
        </div>
        <div className="container home-final-grid">
          <article className="card home-list-card home-theme-card">
            <h3>Technology</h3>
            <ul className="list">
              {homeStudentLife.sports.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card home-list-card home-theme-card">
            <h3>Business & Systems</h3>
            <ul className="list">
              {homeStudentLife.activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card home-list-card home-theme-card">
            <h3>Strategy & Automation</h3>
            <ul className="list">
              {homeStudentLife.feeIncludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
