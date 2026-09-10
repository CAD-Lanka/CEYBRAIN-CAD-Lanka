import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import ContactForm from '@/components/ContactForm';
import PartnerLogos from '@/components/PartnerLogos';
import AnimatedStats from '@/components/AnimatedStats';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/sanity';

export const metadata = {
  title: 'CAD Lanka Engineering — Precision Engineering for Global Railway Infrastructure',
  description:
    'Sri Lankan engineering firm specializing in railway electrification, 2D/3D CAD design, BIM modelling, and MEP documentation for international projects since 2014.',
  openGraph: {
    title: 'CAD Lanka Engineering',
    description: 'Precision Engineering for Global Railway Infrastructure.',
    url: 'https://cadlankaeng.com',
  },
};

export const revalidate = 60;

// ── 5 Real Service cards — 2-per-row layout per §3.2 & §22.2 ─────────────
const SERVICES = [
  {
    id: 'SRV-01',
    refCode: 'CD-01',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: '2D CAD Tracing (Digitizing)',
    description:
      'CAD LANKA provides many of its clients with a simple tracing exercise converting these older 2D microfiche and paper based drawings into digital masters.',
    bullets: [
      'Legacy microfiche & paper conversion',
      'High-fidelity vector master drawings',
      'Layer-structured CAD deliverables',
    ],
    href: '/services#digitizing',
  },
  {
    id: 'SRV-02',
    refCode: 'PD-02',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="0.5"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'Precision 2D & 3D Drawings',
    description:
      'We provide highly accurate and cost effective 3D CAD drawing conversion, 2D to 3D CAD drawings, CAD drafting conversion, CAD file conversion 3D to 2D drawing, paper to CAD conversion, PDF to DWG conversion.',
    bullets: [
      '2D to 3D CAD drawing conversion',
      'PDF to DWG technical vectorization',
      'Fabrication & assembly drawing sets',
    ],
    href: '/services#precision-drawings',
  },
  {
    id: 'SRV-03',
    refCode: 'RE-03',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Railway Electrification',
    description:
      'Engineering and CAD solutions for railway electrification systems, including detailed design, documentation, and 3D modelling.',
    bullets: [
      'Overhead Line Equipment (OLE) layouts',
      'Cantilever & portal frame detailing',
      'Catenary profile & contact wire modeling',
    ],
    href: '/services#railway-electrification',
  },
  {
    id: 'SRV-04',
    refCode: 'BIM-04',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    title: 'BIM & 3D Modelling',
    description:
      'BIM modelling, point-cloud to BIM conversion, clash detection, and 3D coordination.',
    bullets: [
      'Revit architectural & structural modeling',
      'Point-cloud to 3D BIM conversion',
      'Clash detection & spatial coordination',
    ],
    href: '/services#bim-modelling',
  },
  {
    id: 'SRV-05',
    refCode: 'MEP-05',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: 'MEP Drawing & CAD Services',
    description:
      'Professional MEP drafting and BIM modelling services for construction and engineering projects. We produce accurate, detailed and coordinated drawings for Mechanical, Electrical and Plumbing systems, supporting consultants, contractors and engineering companies throughout the project lifecycle.',
    bullets: [
      'Mechanical & HVAC ducting schematics',
      'Electrical containment & lighting drawings',
      'Plumbing, drainage & fire protection coordination',
    ],
    href: '/services#mep-services',
  },
];

export default async function HomePage() {
  let siteSettings = null;
  try {
    siteSettings = await getSiteSettings();
  } catch (err) {
    console.error('Error fetching site settings:', err);
  }

  const contact = siteSettings?.contactInfo || {
    email: 'pr@cadlankaeng.com',
    phone: '+94 71 83 52 747',
    whatsapp: '+94 71 83 52 747',
  };

  return (
    <>
      <Header />
      <main>
        {/* ── 1. Hero Carousel ── */}
        <HeroCarousel />

        {/* ── 2. Animated Stats Bar (Section 14.4 & §22.1) ── */}
        <AnimatedStats stats={siteSettings?.stats} />

        {/* ── 3. Core Services — 5 real services with clean balanced layout (§3.2 & §22.2) ── */}
        <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface border-b border-outline-variant" aria-labelledby="services-heading">
          <div className="max-w-content mx-auto">
            {/* Section header */}
            <div className="flex justify-between items-end mb-lg border-b border-outline-variant pb-md">
              <div>
                <div className="flex items-center gap-sm font-label-mono text-label-mono text-secondary uppercase tracking-widest mb-sm font-bold">
                  <span className="w-8 h-px bg-secondary block" />
                  Service Portfolio
                </div>
                <h2 id="services-heading" className="font-headline-md text-headline-md text-primary">Core Services</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                  Technical capabilities and drafting solutions for railway, MEP, and infrastructure sectors.
                </p>
              </div>
              <span className="font-label-mono text-label-mono text-secondary font-bold hidden md:block">SEC: 02 // SRV</span>
            </div>

            {/* 5-item grid: 2-per-row with the 5th item centered cleanly per §22.2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {SERVICES.map((service, idx) => {
                const isFifth = idx === 4;
                return (
                  <div
                    key={service.id}
                    className={isFifth ? 'md:col-span-2 md:max-w-2xl md:mx-auto w-full' : 'w-full'}
                  >
                    <ScrollReveal delay={idx * 100}>
                      <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg tech-card flex flex-col h-full">
                        <div className="flex justify-between items-start mb-lg">
                          <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded border border-surface-variant text-primary">
                            {service.icon}
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-label-mono text-label-mono text-secondary font-bold">{service.id}</span>
                            <span className="font-label-mono text-[10px] text-secondary font-bold">{service.refCode}</span>
                          </div>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-primary mb-sm">{service.title}</h3>
                        <div className="w-full h-px bg-outline-variant mb-md" />
                        <p className="font-body-md text-body-md text-on-surface-variant mb-md flex-grow">{service.description}</p>
                        <ul className="flex flex-col gap-xs mb-lg">
                          {service.bullets.map((b) => (
                            <li key={b} className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
                              <span className="w-1.5 h-1.5 bg-secondary block flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={service.href}
                          className="font-label-mono text-label-mono text-secondary flex items-center gap-xs hover:underline mt-auto active:scale-[0.98] transition-transform"
                        >
                          EXPLORE →
                        </Link>
                      </div>
                    </ScrollReveal>
                  </div>
                );
              })}
            </div>

            <div className="mt-lg text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-sm border border-primary text-primary font-button-text text-button-text py-sm px-lg rounded hover:bg-primary hover:text-white transition-colors"
              >
                View All Services →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 3.5 Client / Partner Logos Strip (§14.3 & §22.3) ── */}
        <PartnerLogos logos={siteSettings?.partnerLogos} />

        {/* ── 4. CTA Band ── */}
        <section className="border-t border-outline-variant bg-surface py-xl px-margin-mobile md:px-margin-desktop">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center border border-outline-variant p-lg md:p-xl rounded relative bg-surface-container-lowest corner-bracket">
              <div className="font-label-mono text-label-mono text-secondary-container mb-md flex items-center justify-center gap-sm uppercase">
                <span className="w-8 h-px bg-secondary-container" />
                Initiate Sequence
                <span className="w-8 h-px bg-secondary-container" />
              </div>
              <h2 className="font-headline-md text-headline-md text-primary mb-md">
                Start Your Next Infrastructure Project with CAD Lanka.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-xl mx-auto">
                Engage our engineering team for precise, reliable, and globally compliant drafting and design services.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-sm bg-secondary-container text-white font-button-text text-button-text py-sm px-lg rounded hover:bg-secondary active:scale-[0.98] transition-all"
              >
                Contact Our Engineers →
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* ── 5. Home Contact Section per §3.1 & §22.5 ── */}
        <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface border-t border-outline-variant" aria-labelledby="home-contact-heading">
          <ScrollReveal>
            <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xl">

              {/* Left — info */}
              <div className="flex flex-col gap-lg">
                <div>
                  <div className="flex items-center gap-sm font-label-mono text-label-mono text-secondary uppercase tracking-widest mb-sm font-bold">
                    <span className="w-8 h-px bg-secondary block" />
                    Get in Touch
                  </div>
                  <h2 id="home-contact-heading" className="font-headline-md text-headline-md text-primary mb-md">
                    Ready to Engineer Something Exceptional?
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant border-l-2 border-secondary pl-md">
                    Whether you need CAD drafting, BIM modelling, or MEP documentation — our team is ready to deliver to international standards.
                  </p>
                </div>

                {/* Confirmed Contact details per §22.5 */}
                <div className="flex flex-col gap-md">
                  {[
                    {
                      label: 'Email',
                      value: contact.email || 'pr@cadlankaeng.com',
                      href: `mailto:${contact.email || 'pr@cadlankaeng.com'}`,
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                      ),
                    },
                    {
                      label: 'Phone',
                      value: contact.phone || '+94 71 83 52 747',
                      href: `tel:${(contact.phone || '+94 71 83 52 747').replace(/\s+/g, '')}`,
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12 19.79 19.79 0 0 1 1.07 3.4a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.128.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.572 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      ),
                    },
                    {
                      label: 'WhatsApp',
                      value: contact.whatsapp || '+94 71 83 52 747',
                      href: `https://wa.me/${(contact.whatsapp || '+94 71 83 52 747').replace(/[^0-9]/g, '')}`,
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-md group active:scale-[0.98] transition-transform"
                    >
                      <div className="w-10 h-10 bg-surface-container border border-outline-variant rounded flex items-center justify-center text-secondary group-hover:border-primary transition-colors flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-label-mono text-label-mono text-secondary font-bold uppercase tracking-wider">{item.label}</div>
                        <div className="font-body-md text-body-md text-primary group-hover:text-secondary transition-colors">{item.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right — form */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg md:p-xl relative corner-bracket">
                <div className="font-label-mono text-label-mono text-secondary font-bold mb-md uppercase tracking-wider flex items-center gap-sm">
                  <span className="w-2 h-2 bg-secondary-container rounded-full animate-pulse-dot" />
                  Direct Inquiry Form — REF: CL-CI-24
                </div>
                <ContactForm compact />
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
