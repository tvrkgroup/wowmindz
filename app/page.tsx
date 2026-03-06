import Link from "next/link";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { getSiteConfig } from "@/lib/site-config";
import { enforcePageVisibility } from "@/lib/page-visibility";

const specialFeatures = [
  {
    title: "Smart Classrooms",
    detail:
      "Technology integrated learning spaces for visual, interactive and collaborative teaching.",
  },
  {
    title: "Interdisciplinary Curriculum",
    detail:
      "Focus on critical thinking, concept application and practical life skills.",
  },
  {
    title: "STEM Labs",
    detail:
      "Robotics, coding and innovation labs for experimentation and problem solving.",
  },
  {
    title: "Safe & Vibrant Campus",
    detail: "Student wellbeing, safety systems and a positive learning atmosphere.",
  },
  {
    title: "Competitive Foundation",
    detail: "Academic foundation for NEET, IIT and JEE pathways.",
  },
  {
    title: "Sports & Activities",
    detail: "Sports galore and extra curricular activities for all-round development.",
  },
  {
    title: "Language Development",
    detail: "Strong communication practice in reading, writing and speaking.",
  },
  {
    title: "Transport Facility",
    detail: "Reliable route-based school transport support.",
  },
];

const keyBenefits = [
  {
    title: "Expert Curriculum",
    points: [
      "Structured CBSE-oriented concept progression",
      "Critical thinking integrated into daily learning",
    ],
  },
  {
    title: "Modern Facilities",
    points: [
      "Smart classrooms, STEM labs and activity zones",
      "Safe infrastructure that supports focused learning",
    ],
  },
  {
    title: "Professional Educators",
    points: [
      "Experienced teachers with mentoring approach",
      "Individual attention for confidence and growth",
    ],
  },
];

const olympiadExams = [
  "Mathematics Olympiad - UMO",
  "Science Olympiad - USO",
  "English Olympiad - UEO",
  "General Knowledge Olympiad - UGKO",
];

const nationalLevelExams = [
  "National Science Olympiad",
  "National Interactive Mathematics Olympiad - NIMO",
  "National Level Science Talent Search Exam - NLSTSE",
];

const otherExams = [
  "International Mathematics Olympiad - IMO",
  "Unified Cyber Olympiad - UCO",
  "Spell Bee",
];

const sports = ["Basketball", "Football", "Badminton", "Chess"];
const activities = ["Robotics", "Skating", "Yoga", "Archery", "Horse Riding", "Western Dance"];
const feeIncludes = ["3 Sets of Uniform", "School Bag", "Books and Notebooks", "Stationery Items"];

function formatPhoneForHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export default async function Home() {
  await enforcePageVisibility("home");
  const config = await getSiteConfig();

  return (
    <div>
      <Nav />

      <section className="section home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-left">
            <p className="eyebrow home-hero-eyebrow">THE SILVER BROOK PUBLIC SCHOOL</p>
            <h1 className="home-gradient-title">{config.tagline}</h1>
            <p className="home-subline">Where Knowledge Sparks Confidence</p>
            <p className="home-vision-line">I believe I can change the world</p>
            <p className="home-address">{config.address}</p>
            <div className="home-badges">
              <span className="home-badge">Admissions Open - 2026-27</span>
              <span className="home-badge">Grade I to VII</span>
            </div>
            <div className="home-actions">
              <Link href="/admissions" className="button">
                Apply for Admission
              </Link>
              <Link href="/contact" className="button secondary">
                Contact School
              </Link>
            </div>
          </div>

          <aside className="home-hero-right card">
            <h3>CBSE Syllabus</h3>
            <p>(To be affiliated to CBSE Board, New Delhi)</p>
            <div className="divider" />
            <p>Near Ashtalakshmi Temple, Karatoor, Gobichettipalayam</p>
            <p>Contact: 9944055929</p>
            <div className="home-stats">
              <div>
                <strong>I-VII</strong>
                <span>Grades</span>
              </div>
              <div>
                <strong>STEM</strong>
                <span>Labs</span>
              </div>
              <div>
                <strong>CBSE</strong>
                <span>Foundation</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section accent home-section section-pattern">
        <div className="container">
          <h2>Special Features</h2>
          <div className="home-cards-grid">
            {specialFeatures.map((item) => (
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
            {keyBenefits.map((item) => (
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
              <a href={`tel:${formatPhoneForHref(config.contactPhone)}`}>
                <strong>Call Us:</strong> {config.contactPhone}
              </a>
            </div>
            <div className="info-row">
              <span className="icon icon-mail" aria-hidden="true" />
              <a href={`mailto:${config.contactEmail}`}>
                <strong>Email:</strong> {config.contactEmail}
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
                <h2>THE SILVER BROOK PUBLIC SCHOOL</h2>
                <p>(To be affiliated to CBSE Board, New Delhi)</p>
                <p>Near Ashtalakshmi Temple, Karatoor, Gobichettipalayam</p>
                <p>Contact: 9944055929</p>
                <div className="divider" />
                <p>
                  <strong>CBSE SYLLABUS</strong>
                </p>
                <p>Learning is the key to leadership</p>
                <p>Where Knowledge sparks confidence</p>
                <p>
                  <strong>Admissions Open 2026-2027</strong>
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section home-section">
        <div className="container">
          <h2>Competitive Exams for Grade 6 to 8</h2>
          <div className="home-exams-grid">
            <article className="card home-exam-card home-theme-card">
              <h3>Olympiad Exams</h3>
              <ol className="home-ordered-list">
                {olympiadExams.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>

            <article className="card home-exam-card home-theme-card">
              <h3>National Level Exams</h3>
              <ol className="home-ordered-list">
                {nationalLevelExams.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>

            <article className="card home-exam-card home-theme-card">
              <h3>Other Exams</h3>
              <ol className="home-ordered-list">
                {otherExams.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          </div>
          <article className="card home-note-card home-theme-card">
            <p>
              <strong>Note:</strong> These exams help students develop skills, gain
              confidence and prepare for future competitive exams.
            </p>
          </article>
        </div>
      </section>

      <section className="section accent home-section section-pattern">
        <div className="container">
          <div className="home-group-head">
            <h2>Student Life Highlights</h2>
            <p>Sports, co-curricular programs, and student essentials in one place.</p>
          </div>
        </div>
        <div className="container home-final-grid">
          <article className="card home-list-card home-theme-card">
            <h3>Sports</h3>
            <ul className="list">
              {sports.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card home-list-card home-theme-card">
            <h3>Extra Curricular Activities</h3>
            <ul className="list">
              {activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card home-list-card home-theme-card">
            <h3>School Fees Includes</h3>
            <ul className="list">
              {feeIncludes.map((item) => (
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
