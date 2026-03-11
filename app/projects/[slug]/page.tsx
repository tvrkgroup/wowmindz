import { notFound } from "next/navigation";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";
import ProjectGallery from "@/components/projects/ProjectGallery";
import { enforcePageVisibility } from "@/lib/page-visibility";
import { getSiteConfig } from "@/lib/site-config";
import { simpleMarkupToHtml } from "@/lib/rich-text";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  await enforcePageVisibility("academics");
  const config = await getSiteConfig();
  const project = (config.projects || []).find((item) => item.slug === params.slug && item.status === "published");
  if (!project) notFound();

  const images = Array.from(new Set([project.coverImage, ...(project.galleryImages || [])].filter(Boolean)));

  return (
    <div>
      <Nav />
      <section className="section article-detail">
        <div className="container article-detail-wrap project-detail-wrap">
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          <div className="projects-detail-head">
            <p className="article-date">{project.company}</p>
            {project.website ? (
              <a href={project.website} target="_blank" rel="noreferrer" className="button secondary">
                Visit Project Site
              </a>
            ) : null}
          </div>
          <p className="article-summary">{project.summary || project.description}</p>
          <ProjectGallery images={images} title={project.title} />
          <article
            className="article-content"
            dangerouslySetInnerHTML={{ __html: simpleMarkupToHtml(project.content || project.description) }}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
