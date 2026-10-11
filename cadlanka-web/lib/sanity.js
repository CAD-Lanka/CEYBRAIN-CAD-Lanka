import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// All credentials via environment variables — never hardcoded (§4)
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cqa4cz23',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  // Token for server-side write/read operations (not exposed to browser)
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

/** Build a URL for a Sanity image asset */
export function urlFor(source) {
  return builder.image(source);
}

// ── GROQ Queries ─────────────────────────────────────────────────────────────

/** Fetch all projects for the grid (light version — no body/gallery) */
export async function getAllProjects() {
  return client.fetch(`
    *[_type == "project"] | order(year desc) {
      _id,
      title,
      slug,
      "category": category->title,
      location,
      year,
      coverImage,
      heroImage,
    }
  `);
}

/** Fetch a single project by slug (full detail) */
export async function getProjectBySlug(slug) {
  return client.fetch(
    `
    *[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      "category": category->title,
      location,
      year,
      client,
      description,
      coverImage,
      heroImage,
      gallery,
      "ifcModel": ifcModel.asset->{url, originalFilename, size},
      specifications,
      technicalExecution,
    }
  `,
    { slug }
  );
}

/** Fetch all project slugs for static generation */
export async function getAllProjectSlugs() {
  return client.fetch(`
    *[_type == "project"] { "slug": slug.current }
  `);
}

/** Fetch all services */
export async function getAllServices() {
  return client.fetch(`
    *[_type == "service"] | order(_createdAt asc) {
      _id, title, refCode, description, icon, bullets, image
    }
  `);
}

/** Fetch site settings singleton */
export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      stats, contactInfo, partnerCountries, partnerLogos
    }
  `);
}
