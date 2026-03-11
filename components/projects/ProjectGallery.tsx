"use client";

import { useMemo, useState } from "react";

export default function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const slides = useMemo(() => (images.filter(Boolean).length ? images.filter(Boolean) : ["/images/ai-campus-1.svg"]), [images]);
  const [active, setActive] = useState(0);

  if (slides.length === 1) {
    return <img className="projects-slider-image" src={slides[0]} alt={title} />;
  }

  const prev = () => setActive((current) => (current === 0 ? slides.length - 1 : current - 1));
  const next = () => setActive((current) => (current === slides.length - 1 ? 0 : current + 1));

  return (
    <div className="projects-gallery-wrap">
      <div className="projects-slider">
        <button type="button" className="carousel-arrow" onClick={prev} aria-label="Previous image">
          ‹
        </button>
        <img className="projects-slider-image" src={slides[active]} alt={`${title} preview ${active + 1}`} />
        <button type="button" className="carousel-arrow" onClick={next} aria-label="Next image">
          ›
        </button>
      </div>
      <div className="projects-slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`projects-dot ${index === active ? "is-active" : ""}`}
            onClick={() => setActive(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
