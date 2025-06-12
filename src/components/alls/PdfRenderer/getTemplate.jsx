import ResumeTemplate from "./templateOne";

export const getTemplate = (templateId) => {
  const templateRegistry = {
  'template-one': {
    id: 'template-one',
    name: 'Professional Split',
    thumbnail: '/templates/templateone.png',
    description: 'Classic two-column layout with a professional look',
    component: ResumeTemplate
  },
};

  return templateRegistry[templateId];
};