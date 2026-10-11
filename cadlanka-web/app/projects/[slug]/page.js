import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProjectGallery from '@/components/ProjectGallery';
import IfcViewer from '@/components/IfcViewer';
import Link from 'next/link';
import { getProjectBySlug, getAllProjectSlugs, urlFor } from '@/lib/sanity';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllProjectSlugs();
    if (slugs && slugs.length > 0) {
      return slugs.map((s) => ({ slug: s.slug }));
    }
  } catch {
    // Sanity unconfigured or empty
  }
  return [];
}

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) return { title: 'Project Not Found' };
    
    const desc = project.description?.slice(0, 160) || `${project.title} — Technical railway and CAD engineering deliverable by CAD Lanka Engineering.`;
    let ogImages = [];
    if (project.coverImage) {
      try {
        ogImages.push({
          url: urlFor(project.coverImage).width(1200).height(630).fit('crop').url(),
          width: 1200,
          height: 630,
          alt: project.title,
        });
      } catch {}
    }

    return {
      title: project.title,
      description: desc,
      openGraph: {
        title: `${project.title} | CAD Lanka Engineering`,
        description: desc,
        type: 'article',
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: desc,
        images: ogImages.map((img) => img.url),
      },
    };
  } catch {
    return { title: 'Project' };
  }
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  let project = null;

  try {
    project = await getProjectBySlug(slug);
  } catch {
    // Sanity fetch error
  }

  if (!project) {
    notFound();
  }

  // Hotspot-aware image crop via urlFor — §17.1
  const heroImageUrl = project.heroImage
    ? urlFor(project.heroImage).width(1400).height(700).fit('crop').auto('format').url()
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1400" height="700" viewBox="0 0 1400 700"%3E%3Crect width="1400" height="700" fill="%231b2b3a"/%3E%3C/svg%3E';

  return (
    <>
      <Header />
      <main>
        {/* Responsive Hero image with hotspot crop & breadcrumb chip — §17.1 & §17.2 */}
        <div className="w-full h-[280px] sm:h-[360px] md:h-[440px] bg-surface-variant relative overflow-hidden border-b border-outline-variant">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{ backgroundImage: `url('${heroImageUrl}')` }}
            role="img"
            aria-label={`Hero image for project: ${project.title}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/85 opacity-90" />
          <div className="absolute inset-0 flex items-end max-w-content mx-auto px-margin-mobile md:px-margin-desktop pb-md sm:pb-lg">
            <div className="relative z-10 bg-primary/85 backdrop-blur-md border border-outline-variant/40 px-xs sm:px-md py-xs rounded-sm inline-block max-w-[calc(100vw-32px)] overflow-hidden shadow-md">
              <Breadcrumb
                dark
                items={[
                  { label: 'HOME', href: '/' },
                  { label: 'PROJECTS', href: '/projects' },
                  { label: project.title.toUpperCase() },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="max-w-content mx-auto px-margin-mobile md:px-margin-desktop py-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">

            {/* Main content — 2 cols */}
            <div className="lg:col-span-2 flex flex-col gap-xl">

              {/* Title + metadata row */}
              <div>
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-lg">
                  {project.title}
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-md border border-outline-variant rounded divide-x divide-outline-variant">
                  {[
                    { label: 'Category', value: project.category },
                    { label: 'Year', value: project.year },
                    { label: 'Client', value: project.client || 'Confidential' },
                    { label: 'Location', value: project.location },
                  ].map((meta) => (
                    <div key={meta.label} className="px-md py-sm flex flex-col gap-xs">
                      <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">{meta.label}</span>
                      <span className="font-body-sm text-body-sm text-primary font-medium">{meta.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Overview */}
              {project.description && (
                <section aria-labelledby="overview-heading">
                  <div className="flex items-center gap-sm font-label-mono text-label-mono text-outline uppercase tracking-widest mb-md">
                    <span className="w-8 h-px bg-outline block" />
                    Project Overview
                  </div>
                  <h2 id="overview-heading" className="sr-only">Project Overview</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant border-l-2 border-secondary pl-md leading-relaxed">
                    {project.description}
                  </p>
                </section>
              )}

              {/* Technical Execution */}
              {project.technicalExecution?.length > 0 && (
                <section aria-labelledby="execution-heading">
                  <div className="flex items-center gap-sm font-label-mono text-label-mono text-outline uppercase tracking-widest mb-md">
                    <span className="w-8 h-px bg-outline block" />
                    Technical Execution
                  </div>
                  <h2 id="execution-heading" className="sr-only">Technical Execution</h2>
                  <div className="flex flex-col gap-md">
                    {project.technicalExecution.map((item, i) => (
                      <div key={item._key || i} className="bg-surface-container-lowest border border-outline-variant rounded p-md">
                        <div className="flex items-center gap-sm mb-sm">
                          <span className="font-label-mono text-label-mono text-secondary-container w-6 h-6 border border-secondary-container rounded flex items-center justify-center text-[10px] flex-shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h3 className="font-body-md text-body-md text-primary font-semibold">{item.title}</h3>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant pl-9">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Gallery Component — §17.3 */}
              {project.ifcModel?.url && (
                <IfcViewer model={project.ifcModel} title={project.title} />
              )}
              <ProjectGallery gallery={project.gallery} />

              {/* Back to Projects */}
              <div className="pt-md border-t border-outline-variant">
                <Link
                  href="/projects"
                  className="font-label-mono text-label-mono text-primary hover:text-secondary transition-colors flex items-center gap-sm"
                >
                  ← Back to Projects
                </Link>
              </div>
            </div>

            {/* Sidebar — System Specifications */}
            <div className="flex flex-col gap-lg">
              <div className="bg-surface-container-lowest border border-outline-variant rounded sticky top-24">
                <div className="border-b border-outline-variant px-lg py-md flex justify-between items-center">
                  <h2 className="font-headline-sm text-headline-sm text-primary">System Specs</h2>
                  <span className="font-label-mono text-label-mono text-secondary font-bold">SPEC-01</span>
                </div>
                {project.specifications?.length > 0 ? (
                  <ul className="divide-y divide-outline-variant">
                    {project.specifications.map((spec, i) => (
                      <li key={spec._key || i} className="px-lg py-sm flex justify-between gap-md">
                        <span className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider flex-shrink-0">
                          {spec.label}
                        </span>
                        <span className="font-label-mono text-label-mono text-primary text-right">
                          {spec.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-lg py-md font-label-mono text-label-mono text-on-surface-variant">
                    No specifications listed.
                  </div>
                )}
                <div className="border-t border-outline-variant px-lg py-md">
                  <Link
                    href="/contact"
                    className="w-full block text-center bg-secondary-container text-white font-button-text text-button-text py-sm px-md rounded hover:bg-secondary transition-colors"
                  >
                    Discuss This Project →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
