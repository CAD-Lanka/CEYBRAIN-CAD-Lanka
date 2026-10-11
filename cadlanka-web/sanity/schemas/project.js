/** Sanity schema: project */
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (R) => R.required(),
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'e.g. 2023',
      validation: (R) => R.required(),
    },
    {
      name: 'projectPdf',
      title: 'Project PDF',
      type: 'file',
      options: { accept: '.pdf' },
      description: 'Upload a PDF drawing, report, or brochure to display on this public project page.',
      validation: (R) => R.custom((file) => {
        if (!file?.asset?._ref) return true;
        return file.asset._ref.endsWith('-pdf') || 'Please upload a .pdf file.';
      }),
    },
    {
      name: 'ifcModel',
      title: '3D Model (IFC)',
      type: 'file',
      options: { accept: '.ifc' },
      description: 'Upload an IFC model to show a public interactive 3D viewer on this project. The uploaded file is publicly accessible. Recommended size: under 50 MB.',
      validation: (R) => R.custom((file) => {
        if (!file?.asset?._ref) return true;
        return file.asset._ref.endsWith('-ifc') || 'Please upload an .ifc file.';
      }),
    },
    {
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Client name (leave blank to display "Confidential")',
    },
    {
      name: 'location',
      title: 'Location / Country',
      type: 'string',
      description: 'e.g. Oslo, Norway',
      validation: (R) => R.required(),
    },
    {
      name: 'description',
      title: 'Project Overview',
      type: 'text',
      rows: 6,
      validation: (R) => R.required(),
    },
    {
      name: 'coverImage',
      title: 'Cover Image (shown on Projects grid card)',
      description: 'Used for project cards in the grid. If left empty, Hero Image will be used as fallback.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
    {
      name: 'heroImage',
      title: 'Hero Image (shown at top of project detail page)',
      description: 'Full-width top banner for the project detail page.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (R) => R.required().error('Alt text is required for accessibility.'),
        },
      ],
    },
    {
      name: 'gallery',
      title: 'Project Pictures',
      description: 'Upload pictures to appear below the project details and above Project Overview. Add captions and drag to reorder.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Technical caption (e.g. FIG 01: Overhead Line Assembly)',
            },
          ],
          preview: {
            select: {
              media: 'asset',
              caption: 'caption',
              alt: 'alt',
            },
            prepare({ media, caption, alt }) {
              return {
                title: caption || alt || 'Gallery Image',
                media,
              };
            },
          },
        },
      ],
    },
    {
      // Flexible key-value — not fixed fields, per Phase 6 requirement
      name: 'specifications',
      title: 'System Specifications',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'spec',
          fields: [
            { name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() },
            { name: 'value', title: 'Value', type: 'string', validation: (R) => R.required() },
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    },
    {
      name: 'technicalExecution',
      title: 'Technical Execution',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'executionItem',
          fields: [
            { name: 'title', title: 'Step Title', type: 'string', validation: (R) => R.required() },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      year: 'year',
      media: 'heroImage',
    },
    prepare({ title, location, year, media }) {
      return { title, subtitle: `${location} · ${year}`, media };
    },
  },
};
