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
    "Website development, QuizLexa and CourseLexa learning platforms, and upcoming business management systems from WowMindz.",
};

const products = [
  {
    name: "QuizLexa",
    label: "Assess. Understand. Improve.",
    description:
      "A dedicated space for quizzes and assessments, within the WowMindz learning ecosystem.",
    kind: "Assessment platform",
    mark: "Q",
  },
  {
    name: "CourseLexa",
    label: "Teach. Learn. Move forward.",
    description:
      "A home for courses and structured learning, within the same connected LMS ecosystem.",
    kind: "Course platform",
    mark: "C",
  },
];

const upcoming = [
  {
    code: "HMS",
    name: "Hospital Management",
    description:
      "Connected systems for healthcare operations and administration.",
  },
  {
    code: "CMS",
    name: "Construction Management",
    description:
      "A clearer view of construction projects, resources, and progress.",
  },
  {
    code: "ERP",
    name: "Enterprise Resource Planning",
    description:
      "Business processes and resources, brought into one connected system.",
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
      title: "WowMindz LMS",
      domain: "lms.wowmindz.com",
      type: "QuizLexa + CourseLexa",
    },
  ];
  const otherWork = published.filter(
    (project) =>
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
          <div className={styles.brandObject} aria-hidden="true">
            <div className={styles.orbit} />
            <div className={styles.orbitInner} />
            <span className={styles.objectLabel}>Ideas, connected.</span>
            <div className={styles.core}>
              <img src={config.logoPath || "/logo.png"} alt="" />
            </div>
            <span className={`${styles.node} ${styles.nodeWeb}`}>
              01 / Websites
            </span>
            <span className={`${styles.node} ${styles.nodeLearn}`}>
              02 / Learning
            </span>
            <span className={`${styles.node} ${styles.nodeSystems}`}>
              03 / Systems
            </span>
            <span className={styles.objectFoot}>Involve. Solve. Evolve.</span>
          </div>
        </section>

        <nav
          className={`container ${styles.index}`}
          aria-label="Explore services"
        >
          <a href="#websites">
            <span>01</span> Website Development <Arrow />
          </a>
          <a href="#learning">
            <span>02</span> Learning Platforms <Arrow />
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
          id="learning"
          className={`container ${styles.serviceSection}`}
          aria-labelledby="lms-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>02 / Learning management systems</p>
            <span className={styles.status}>Live products</span>
          </div>
          <div className={styles.sectionIntro}>
            <h2 id="lms-title">
              Two products.
              <br />
              One learning ecosystem.
            </h2>
            <p>
              Our LMS brings QuizLexa and CourseLexa together under one roof, at
              lms.wowmindz.com.
            </p>
          </div>
          <div className={styles.products}>
            {products.map((product) => (
              <article key={product.name} className={styles.product}>
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
                  href="https://lms.wowmindz.com"
                  className={styles.productLink}
                >
                  Explore {product.name} <Arrow diagonal />
                </a>
              </article>
            ))}
          </div>
          <p className={styles.productNote}>
            Both products are available through our shared LMS portal.
          </p>
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
                <article className={styles.workRow} key={work.domain}>
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
              <article className={styles.workRow} key={project.id}>
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
              Our next chapter focuses on the tools that help organisations work
              better. These systems are upcoming and aren&apos;t available yet.
            </p>
          </div>
          <div className={styles.roadmap}>
            {upcoming.map((item) => (
              <article key={item.code}>
                <span className={styles.systemCode}>{item.code}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className={styles.roadmapLabel}>
                  On the horizon{" "}
                  <span aria-hidden="true">&middot;&middot;&middot;</span>
                </span>
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
