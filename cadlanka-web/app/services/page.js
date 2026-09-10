import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ScrollReveal from '@/components/ScrollReveal';
import { getAllServices, urlFor } from '@/lib/sanity';

export const metadata = {
  title: 'Engineering Services',
  description:
    'Professional technical drawing, 3D modelling, and engineering documentation solutions. 2D CAD Tracing, Precision 2D & 3D Drawings, Railway Electrification, BIM Modelling, and MEP CAD Services.',
};

export const revalidate = 60;

const ICONS = {
  'CD-01': (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  'PD-02': (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="0.5"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  'RE-03': (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  'BIM-04': (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  'MEP-05': (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  ),
};

const SUBTITLES = {
  'CD-01': 'Legacy Drawing Conversion & Master Vectorization',
  'PD-02': 'Parametric 3D Modeling & Technical CAD Packages',
  'RE-03': 'Overhead Line Equipment & Railway Infrastructure',
  'BIM-04': 'Revit Coordination, Scan-to-BIM & Clash Detection',
  'MEP-05': 'Mechanical, Electrical, HVAC & Plumbing Coordination',
};

const ANCHORS = {
  'CD-01': 'digitizing',
  'PD-02': 'precision-drawings',
  'RE-03': 'railway-electrification',
  'BIM-04': 'bim-modelling',
  'MEP-05': 'mep-services',
};

function getServiceImageUrl(img) {
  if (!img) return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%231b2b3a"/%3E%3C/svg%3E';
  try {
    return urlFor(img).width(1200).height(800).fit('crop').auto('format').url();
  } catch {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%231b2b3a"/%3E%3C/svg%3E';
  }
}

export default async function ServicesPage() {
  let services = [];
  try {
    services = await getAllServices();
  } catch (err) {
    console.error('Error fetching services from Sanity:', err);
  }

  // Sort services by refCode: CD-01, PD-02, RE-03, BIM-04, MEP-05
  const sortedServices = [...services].sort((a, b) => (a.refCode || '').localeCompare(b.refCode || ''));

  return (
    <>
      <Header />
      <main>
        {/* Page header */}
        <header className="relative bg-surface border-b border-outline-variant overflow-hidden">
          <div className="max-w-content mx-auto px-margin-mobile md:px-margin-desktop py-xl">
            <Breadcrumb
              items={[
                { label: 'HOME', href: '/' },
                { label: 'SERVICES' },
              ]}
            />
            <div className="mt-md max-w-4xl">
              <div className="flex items-center gap-sm font-label-mono text-label-mono text-outline uppercase tracking-widest mb-sm">
                <span className="w-8 h-px bg-outline block" />
                Service Portfolio
              </div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-md">
                Engineering Services
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-secondary pl-md">
                Professional engineering design, CAD drafting, and BIM modelling solutions for railway, MEP, mechanical, and international infrastructure projects.
              </p>
            </div>
          </div>
          {/* Decorative engineering icon */}
          <div className="absolute right-margin-desktop top-xl hidden lg:block opacity-[0.07] pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#051625" strokeWidth="1" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="0.5"/><path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
        </header>

        {/* 5 Real Service sections (§22.2) */}
        <div className="py-xl px-margin-mobile md:px-margin-desktop max-w-content mx-auto grid grid-cols-1 gap-xl">
          {sortedServices.map((service, idx) => {
            const isEven = idx % 2 === 0;
            const ref = service.refCode || `SRV-0${idx + 1}`;
            const anchorId = ANCHORS[ref] || `service-${idx + 1}`;
            const icon = ICONS[ref] || ICONS['CD-01'];
            const subtitle = SUBTITLES[ref] || '';
            const imgSrc = getServiceImageUrl(service.image);

            return (
              <ScrollReveal key={service._id || ref} delay={idx * 100}>
                <section
                  id={anchorId}
                  className="group relative bg-surface-container-lowest border border-outline-variant rounded overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-tech"
                  aria-labelledby={`service-${ref}`}
                >
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Text Details Column */}
                    <div className={`p-lg md:w-1/2 flex flex-col justify-center border-b md:border-b-0 ${isEven ? 'md:border-r' : 'md:border-l'} border-outline-variant`}>
                      <div className="flex items-center justify-between mb-md">
                        <div className="text-secondary">{icon}</div>
                        <span className="font-label-mono text-label-mono text-secondary font-bold">REF: {ref}</span>
                      </div>
                      <h2 id={`service-${ref}`} className="font-headline-md text-headline-md text-primary mb-xs">
                        {service.title}
                      </h2>
                      {subtitle && (
                        <p className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider mb-sm">
                          {subtitle}
                        </p>
                      )}
                      <div className="dimension-line mb-md" />
                      <p className="font-body-md text-body-md text-on-surface-variant mb-md leading-relaxed">
                        {service.description}
                      </p>
                      {service.bullets?.length > 0 && (
                        <ul className="font-body-md text-body-md text-on-surface-variant space-y-xs mb-lg">
                          {service.bullets.map((b) => (
                            <li key={b} className="flex items-center gap-sm">
                              <span className="w-1.5 h-1.5 bg-secondary block flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Image Column */}
                    <div className="md:w-1/2 min-h-[280px] md:min-h-[360px] bg-surface-variant relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${imgSrc}')` }}
                        role="img"
                        aria-label={`${service.title} technical illustration`}
                      />
                      <div className="absolute bottom-sm right-sm bg-surface-container-lowest/90 backdrop-blur-sm border border-secondary/40 px-sm py-xs font-label-mono text-label-mono text-secondary font-bold text-[10px]">
                        {`${ref} // SPEC_ACTIVE`}
                      </div>
                    </div>
                  </div>
                </section>
              </ScrollReveal>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
