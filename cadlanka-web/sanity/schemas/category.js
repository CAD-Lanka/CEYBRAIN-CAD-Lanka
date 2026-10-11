/** Sanity schema: category (taxonomy for project filtering) */
export default {
  name: 'category',
  title: 'Project Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Category Name',
      type: 'string',
      description: 'Enter a category name, e.g. Railway, MEP Engineering, or BIM & Revit.',
      validation: (R) => R.required(),
    },
  ],
  preview: { select: { title: 'title' } },
};
