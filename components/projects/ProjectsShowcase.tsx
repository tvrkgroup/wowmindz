"use client";

import { useMemo } from "react";
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

  if (published.length === 0) {
    return <p className="admin-help">No published projects available yet.</p>;
  }

  return (
    <div className="projects-layout">
      <div className="projects-grid">
        {published.map((project) => (
          <a
            key={project.id}
            className="projects-card"
            href={project.website || "#"}
            target={project.website ? "_blank" : undefined}
            rel={project.website ? "noreferrer" : undefined}
          >
            <img src={project.images[0]} alt={project.title} />
            <div className="projects-card-content">
              <strong>{project.title}</strong>
              <span>{project.company || "Company profile"}</span>
              <p>{project.description || "Project overview"}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
