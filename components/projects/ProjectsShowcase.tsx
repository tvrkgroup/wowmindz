"use client";

import { useMemo, useState } from "react";
import type { SiteProject } from "@/lib/site-config-schema";

interface ProjectsShowcaseProps {
  projects: SiteProject[];
}

function normalizeProject(project: SiteProject) {
  const gallery = (project.galleryImages || []).filter(Boolean);
  const merged = project.coverImage ? [project.coverImage, ...gallery] : gallery;
  const unique = Array.from(new Set(merged));
  return {
    ...project,
    images: unique.length > 0 ? unique : ["/images/ai-campus-1.svg"],
  };
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const published = useMemo(() => projects.filter((item) => item.status === "published").map(normalizeProject), [projects]);
  const [activeProjectId, setActiveProjectId] = useState<string>(published[0]?.id || "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeProject = published.find((item) => item.id === activeProjectId) ?? published[0] ?? null;

  const changeProject = (id: string) => {
    setActiveProjectId(id);
    setActiveImageIndex(0);
  };

  const shiftImage = (direction: "prev" | "next") => {
    if (!activeProject) return;
    const total = activeProject.images.length;
    if (total <= 1) return;
    setActiveImageIndex((current) => (direction === "next" ? (current + 1) % total : (current - 1 + total) % total));
  };

  if (published.length === 0) {
    return <p className="admin-help">No published projects available yet.</p>;
  }

  return (
    <div className="projects-layout">
      <div className="projects-grid">
        {published.map((project) => (
          <button
            key={project.id}
            type="button"
            className={`projects-card ${activeProject?.id === project.id ? "is-active" : ""}`}
            onClick={() => changeProject(project.id)}
          >
            <img src={project.images[0]} alt={project.title} />
            <div className="projects-card-content">
              <strong>{project.title}</strong>
              <span>{project.company || "Company profile"}</span>
            </div>
          </button>
        ))}
      </div>

      {activeProject ? (
        <article className="projects-detail card info-card">
          <div className="projects-detail-head">
            <div>
              <h3>{activeProject.title}</h3>
              <p>{activeProject.company || "Company details"}</p>
            </div>
            {activeProject.website ? (
              <a href={activeProject.website} target="_blank" rel="noreferrer" className="button secondary">
                Visit Project
              </a>
            ) : null}
          </div>
          <p>{activeProject.description}</p>

          <div className="projects-slider">
            <button type="button" className="carousel-arrow" onClick={() => shiftImage("prev")}>
              {"<"}
            </button>
            <img
              src={activeProject.images[activeImageIndex] || activeProject.images[0]}
              alt={`${activeProject.title} gallery ${activeImageIndex + 1}`}
              className="projects-slider-image"
            />
            <button type="button" className="carousel-arrow" onClick={() => shiftImage("next")}>
              {">"}
            </button>
          </div>

          {activeProject.images.length > 1 ? (
            <div className="projects-slider-dots">
              {activeProject.images.map((image, index) => (
                <button
                  type="button"
                  key={`${activeProject.id}-${image}`}
                  className={`projects-dot ${index === activeImageIndex ? "is-active" : ""}`}
                  aria-label={`Show image ${index + 1}`}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          ) : null}
        </article>
      ) : null}
    </div>
  );
}
