import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { enforcePageVisibility } from "@/lib/page-visibility";
import { getSiteConfig } from "@/lib/site-config";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services & Products | WowMindz Technologies",
  description:
    "Website development and LexaMent, the modular management platform from WowMindz. Explore EdLexa today, with MedLexa and BldLexa coming soon.",
};

const products = [
  {
    name: "QuizLexa",
    label: "Assess. Understand. Improve.",
    description:
      "Manage MCQ tests, mock tests, question banks, reports and test selling, with assessment security settings and certificates for eligible assessments.",
    kind: "Assessment platform",
    mark: "Q",
    href: "https://lms.wowmindz.com/quizlexa",
  },
  {
    name: "CourseLexa",
    label: "Teach. Learn. Move forward.",
    description:
      "Create courses, deliver lessons and manage learner access, progress and branding, with certificates for eligible courses.",
    kind: "Course platform",
    mark: "C",
    href: "https://lms.wowmindz.com/courselexa",
  },
];

const upcoming = [
  {
    code: "MedLexa",
    name: "Healthcare management",
    description: "A future healthcare-management division under LexaMent. Coming soon; early-access enquiries are open.",
    href: "https://lms.wowmindz.com/medlexa",
  },
  {
    code: "BldLexa",
    name: "Construction & property management",
    description: "A future construction and property-management division under LexaMent. Coming soon; early-access enquiries are open.",
    href: "https://lms.wowmindz.com/bldlexa",
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default async function ServicesPage() {
  await enforcePageVisibility("academics");
  const config = await getSiteConfig();
  const published = (config.projects || []).filter(
    (project) => project.status === "published",
  );
  const featured = [
    { title: "Prathipa", domain: "prathipa.com", type: "Website development" },
    { title: "KTVR", domain: "ktvr.in", type: "Website development" },
    {
      title: "LexaMent",
      domain: "lms.wowmindz.com",
      type: "Modular management platform · EdLexa available now",
    },
  ];
  const otherWork = published.filter(
    (project) =>
      hostOf(project.website) !== "wowmyspace.com" &&
      !/wowmyspace/i.test(`${project.title} ${project.slug}`) &&
      !featured.some((item) => item.domain === hostOf(project.website)),
  );

  return (
    <div>
      <Nav />
      <main className={styles.services}>
        <section
          className={`container ${styles.hero}`}
          aria-labelledby="services-title"
        >
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Services & products</p>
            <h1 id="services-title">
              Built for your business.
              <br />
              <em>Ready for what&apos;s next.</em>
            </h1>
            <p className={styles.intro}>
              From your first website to the systems behind your growth. We
              design and build digital experiences that bring your ideas into
              everyday use.
            </p>
            <div className={styles.actions}>
              <Link href="/contact" className="button">
                Let&apos;s build together <Arrow />
              </Link>
              <a href="#selected-work" className={styles.textLink}>
                Explore our work <Arrow />
              </a>
            </div>
          </div>
          <nav className={styles.brandObject} aria-label="Service orbit">
            <div className={styles.orbit} />
            <div className={styles.orbitInner} />
            <span className={styles.objectLabel}>Ideas, connected.</span>
            <div className={styles.core}>
              <img src={config.logoPath || "/logo.png"} alt="" />
            </div>
            <a href="#websites" className={`${styles.node} ${styles.nodeWeb}`}>
              01 / Websites
            </a>
            <a
              href="#management"
              className={`${styles.node} ${styles.nodeLearn}`}
            >
              02 / LexaMent
            </a>
            <a href="#next" className={`${styles.node} ${styles.nodeSystems}`}>
              03 / Systems
            </a>
            <span className={styles.objectFoot}>Involve. Solve. Evolve.</span>
          </nav>
        </section>

        <nav
          className={`container ${styles.index}`}
          aria-label="Explore services"
        >
          <a href="#websites">
            <span>01</span> Website Development <Arrow />
          </a>
          <a href="#management">
            <span>02</span> Management Platforms <Arrow />
          </a>
          <a href="#next">
            <span>03</span> What&apos;s Next <Arrow />
          </a>
        </nav>

        <section
          id="websites"
          className={`container ${styles.serviceSection}`}
          aria-labelledby="web-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>01 / Website development</p>
            <span className={styles.status}>Available now</span>
          </div>
          <div className={styles.webLayout}>
            <div>
              <h2 id="web-title">
                Your business.
                <br />A better digital presence.
              </h2>
              <p className={styles.description}>
                A website should make your business easier to understand, trust,
                and reach. We bring thoughtful design and practical development
                together to make that happen.
              </p>
              <Link href="/contact" className={styles.textLink}>
                Discuss your website <Arrow />
              </Link>
            </div>
            <div className={styles.deliverables}>
              {[
                [
                  "01",
                  "Designed around your brand",
                  "A clear visual identity, purposeful content, and a distinct first impression.",
                ],
                [
                  "02",
                  "Built for every screen",
                  "Responsive experiences with considered navigation and readable content.",
                ],
                [
                  "03",
                  "Made to grow with you",
                  "From business websites to custom platforms, shaped around what you need next.",
                ],
              ].map(([number, title, text]) => (
                <div key={number}>
                  <span>{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="selected-work"
          className={`container ${styles.serviceSection}`}
          aria-labelledby="work-title"
        >
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.kicker}>Selected work</p>
              <h2 id="work-title">Ideas put into practice.</h2>
            </div>
            <p>
              A selection of websites and platforms we&apos;ve built. Explore
              the live experiences.
            </p>
          </div>
          <div className={styles.workList}>
            {featured.map((work, index) => {
              const project = published.find(
                (item) => hostOf(item.website) === work.domain,
              );
              return (
                <article
                  data-interactive-surface
                  className={styles.workRow}
                  key={work.domain}
                >
                  <span className={styles.workNumber}>0{index + 1}</span>
                  <div className={styles.workName}>
                    <h3>{work.title}</h3>
                    <p>{work.type}</p>
                  </div>
                  <div className={styles.workActions}>
                    {project && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className={styles.detailLink}
                      >
                        View details
                      </Link>
                    )}
                    <a
                      href={`https://${work.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${work.domain} (opens in a new tab)`}
                    >
                      {work.domain}
                      <Arrow diagonal />
                    </a>
                  </div>
                </article>
              );
            })}
            {otherWork.map((project) => (
              <article
                data-interactive-surface
                className={styles.workRow}
                key={project.id}
              >
                <span className={styles.workNumber} aria-hidden="true">
                  +
                </span>
                <div className={styles.workName}>
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
                <div className={styles.workActions}>
                  <Link href={`/projects/${project.slug}`}>
                    View project <Arrow />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.productNote}>
            And more. Have something in mind?{" "}
            <Link href="/contact">Let&apos;s talk about it.</Link>
          </p>
        </section>

        <section
          id="management"
          className={`container ${styles.serviceSection}`}
          aria-labelledby="lms-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>02 / LexaMent management platform</p>
            <span className={styles.status}>EdLexa available now</span>
          </div>
          <div className={styles.sectionIntro}>
            <h2 id="lms-title">
              Focused divisions.
              <br />
              One management platform.
            </h2>
            <p>
              LexaMent is the modular management platform from WowMindz.
              Start with EdLexa for education, learning and assessment. MedLexa
              and BldLexa are coming soon.
            </p>
          </div>
          <span id="learning" aria-hidden="true" />
          <div className={styles.platformIntro}>
            <a href="https://lms.wowmindz.com/" className="button" target="_blank" rel="noopener noreferrer">
              Explore LexaMent <Arrow diagonal />
            </a>
            <p className={styles.description}>Discover focused management divisions from WowMindz. Start with EdLexa for education, learning and assessment.</p>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.kicker}>LexaMent / Available now</p>
                <h3>EdLexa</h3>
              </div>
              <a href="https://lms.wowmindz.com/edlexa" className={styles.textLink} target="_blank" rel="noopener noreferrer">Explore EdLexa <Arrow diagonal /></a>
            </div>
            <p className={styles.description}>Our education-management division brings CourseLexa and QuizLexa together, with shared assistance from Lexa AI.</p>
          </div>
          <div className={styles.products}>
            {products.map((product) => (
              <article
                data-interactive-surface
                key={product.name}
                className={styles.product}
              >
                <div className={styles.productTop}>
                  <span className={styles.productMark} aria-hidden="true">
                    {product.mark}
                    <i />
                  </span>
                  <span className={styles.productType}>{product.kind}</span>
                </div>
                <h3>{product.name}</h3>
                <p className={styles.productTagline}>{product.label}</p>
                <p className={styles.productDescription}>
                  {product.description}
                </p>
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Explore ${product.name} (opens in a new tab)`}
                  className={styles.productLink}
                >
                  Explore {product.name} <Arrow diagonal />
                </a>
              </article>
            ))}
          </div>
          <p className={styles.productNote}>
            Certificates are part of EdLexa and apply to eligible CourseLexa courses and QuizLexa assessments.
          </p>
          <aside className={styles.platformIntro} aria-label="EdLexa shared assistance">
            <h3>Lexa AI, shared across EdLexa</h3>
            <p className={styles.description}>Free guidance and help are available now. Advanced task-based AI tools are planned, with transparent credit usage when introduced.</p>
            <div className={styles.actions}>
              <a className={styles.textLink} href="https://lms.wowmindz.com/sign-in" target="_blank" rel="noopener noreferrer">Open workspace <Arrow diagonal /></a>
              <a className={styles.textLink} href="https://lms.wowmindz.com/academies" target="_blank" rel="noopener noreferrer">Find an academy <Arrow diagonal /></a>
              <a className={styles.textLink} href="https://lms.wowmindz.com/help" target="_blank" rel="noopener noreferrer">Get help <Arrow diagonal /></a>
            </div>
          </aside>
        </section>

        <section
          id="next"
          className={`container ${styles.serviceSection}`}
          aria-labelledby="next-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>03 / What&apos;s next</p>
            <span className={styles.upcomingStatus}>Upcoming</span>
          </div>
          <div className={styles.sectionIntro}>
            <h2 id="next-title">
              Bigger systems.
              <br />
              Real-world possibilities.
            </h2>
            <p>
              The next LexaMent divisions will focus on healthcare and construction/property management. Both are coming soon and open for early-access enquiries only.
            </p>
          </div>
          <div className={styles.roadmap}>
            {upcoming.map((item) => (
              <article data-interactive-surface key={item.code}>
                <span className={styles.systemCode}>{item.code}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <a href={item.href} className={styles.roadmapLabel} target="_blank" rel="noopener noreferrer">Coming soon · Early access <Arrow diagonal /></a>
              </article>
            ))}
          </div>
          <div className={styles.closing}>
            <div>
              <p className={styles.kicker}>Built around your next move</p>
              <h2>Have a different system in mind?</h2>
              <p>
                Tell us about your workflow, your challenge, or your idea.
                Let&apos;s explore what we can build together.
              </p>
            </div>
            <Link href="/contact" className="button">
              Start a conversation <Arrow />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
