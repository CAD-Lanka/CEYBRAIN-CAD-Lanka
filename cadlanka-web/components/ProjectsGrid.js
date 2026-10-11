'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { urlFor } from '@/lib/sanity';

export default function ProjectsGrid({ projects = [] }) {
  const [activeFilter, setActiveFilter] = useState('All Projects');

  const categories = useMemo(() => [
    'All Projects',
    ...new Set((projects || []).map((project) => project.category).filter((category) => category && category !== 'All Projects')),
  ], [projects]);

  const filtered = useMemo(() => {
    const list = projects || [];
    if (activeFilter === 'All Projects') return list;
    return list.filter((p) => p.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-sm mb-lg border-b border-outline-variant pb-md" role="tablist" aria-label="Project category filters">
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
            className={`font-label-mono text-label-mono px-sm py-xs rounded border transition-all duration-150 uppercase tracking-wider ${
              activeFilter === cat
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2-per-row grid — §3.3 */}
      {filtered.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant font-label-mono text-label-mono uppercase tracking-wider">
          No projects found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filtered.map((project, idx) => {
            const coverAsset = project.coverImage || project.heroImage;
            let imgSrc = null;
            if (coverAsset) {
              try {
                imgSrc = urlFor(coverAsset).width(800).height(450).fit('crop').auto('format').url();
              } catch {
                // Fallback if urlFor fails
              }
            }
            if (!imgSrc) {
              imgSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%231b2b3a"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="%238292a5"%3ECAD LANKA ENGINEERING%3C/text%3E%3C/svg%3E';
            }
            return (
              <ScrollReveal key={project._id} delay={idx * 100}>
                <Link
                  href={`/projects/${project.slug.current}`}
                  className="group bg-surface-container-lowest border border-outline-variant rounded overflow-hidden tech-card flex flex-col h-full active:scale-[0.99] transition-transform"
                  aria-label={`View project: ${project.title}`}
                >
                  {/* Large image — 2-per-row emphasis §3.3 */}
                  <div className="h-64 bg-surface-variant relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${imgSrc}')` }}
                      role="img"
                      aria-label={project.title}
                    />
                    {/* Category badge */}
                    <div className="absolute top-md left-md">
                      <span className="bg-primary/90 text-on-primary font-label-mono text-label-mono px-sm py-xs">
                        {project.category}
                      </span>
                    </div>
                    {/* Year */}
                    <div className="absolute top-md right-md">
                      <span className="bg-surface-container-lowest/90 text-primary font-label-mono text-label-mono px-sm py-xs border border-outline-variant">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-lg flex flex-col gap-sm flex-grow">
                    <div className="dimension-line" />
                    <h3 className="font-headline-sm text-headline-sm text-primary mt-md group-hover:text-secondary transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-sm font-label-mono text-label-mono text-on-surface-variant">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {project.location}
                    </div>
                    <div className="mt-auto pt-sm border-t border-outline-variant flex items-center justify-between font-label-mono text-label-mono">
                      <span className="text-outline">VIEW PROJECT</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary group-hover:translate-x-1 transition-transform" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </>
  );
}
