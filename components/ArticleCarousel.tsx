"use client";

import Link from "next/link";
import type { SitePost } from "@/lib/site-config-schema";

export default function ArticleCarousel({
  posts,
  basePath,
}: {
  posts: SitePost[];
  basePath: "/news" | "/blog";
}) {
  const formatDate = (value: string) => {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    return new Date(parsed).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="article-carousel-wrap">
      <div className="article-carousel article-preview-grid">
        {posts.map((post) => (
          <Link className="article-card article-preview-card" key={post.id} href={`${basePath}/${post.slug}`}>
            <h3>{post.title}</h3>
            <img src={post.image || "/images/ai-campus-1.svg"} alt={post.title} />
            <div className="article-meta-row">
              <div>
                <p className="article-date">{formatDate(post.date)}</p>
                <p className="article-category">{post.category}</p>
              </div>
              <span className="button secondary article-read-btn">View Details</span>
            </div>
            <p>{post.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
