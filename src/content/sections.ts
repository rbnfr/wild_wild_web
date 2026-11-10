// Anchors of the home page, shared by the sections and every link to them.
// They stay in Spanish in every language so existing links keep working.
export const sectionIds = {
  home: "inicio",
  about: "sobre-mi",
  services: "servicios",
  outreach: "divulgacion",
  collaborations: "colaboraciones",
  contact: "contacto",
} as const;

export type SectionKey = keyof typeof sectionIds;
export const sectionHash = (key: SectionKey) => `#${sectionIds[key]}`;
