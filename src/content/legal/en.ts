import type { Dictionary } from "@/content/dictionaries";
import { email, ownerLines } from "./owner";

const owner = ownerLines({
  owner: "Owner",
  taxId: "Tax ID (NIF)",
  address: "Address",
  email: "Email",
  pending: "to be completed",
});
const spanishPrevails =
  "This is a translation for information purposes. In case of discrepancy, the Spanish version prevails.";

export const legal: Dictionary["legal"] = {
  legalNotice: {
    title: "Legal notice",
    description: "Site owner details and terms of use.",
    sections: [
      {
        title: "Site owner",
        paragraphs: [
          "In accordance with article 10 of Spanish Law 34/2002 on information society services and electronic commerce (LSSI-CE), the owner of this website is:",
          ...owner,
        ],
      },
      {
        title: "Terms of use",
        paragraphs: [
          "Access to this site is free of charge and implies acceptance of these terms. Users agree to make appropriate use of the content and not to use it for unlawful purposes.",
          "The information published is for general outreach and does not replace an individual professional assessment.",
        ],
      },
      {
        title: "Intellectual property",
        paragraphs: [
          "The texts, photographs and other content on this site belong to its owner or are used with permission. Reproduction, distribution or public communication without express permission is prohibited, except for uses permitted by law.",
        ],
      },
      {
        title: "External links",
        paragraphs: [
          "This site links to social networks, media outlets and third-party shops. The owner is not responsible for their content or policies, which are governed by their own terms.",
        ],
      },
      {
        title: "Applicable law",
        paragraphs: [
          "These terms are governed by Spanish law.",
          spanishPrevails,
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy policy",
    description:
      "How the data you send by email and the visit statistics are handled.",
    sections: [
      { title: "Data controller", paragraphs: owner },
      {
        title: "What data is processed and why",
        paragraphs: [
          "The contact form neither sends nor stores any data: it prepares a draft on your device. Only when you send the email from your own app is the data you include received (name, email, phone, organisation and message).",
          "It is used solely to answer your enquiry or proposal and, where applicable, to provide the service you request. It is never used for advertising.",
        ],
      },
      {
        title: "Visit statistics",
        paragraphs: [
          "Umami, a cookieless analytics tool, is used to know how many people visit the site and which pages they read. It records aggregated data: page visited, referring site, country, device type, browser and operating system. It does not keep your IP address, sets no cookies, stores nothing on your device and cannot identify you or follow you across sites.",
          "If your browser has “Do Not Track” enabled, your visit is not recorded. The legal basis is the legitimate interest in knowing how the site is used in order to improve it (art. 6.1.f GDPR).",
        ],
      },
      {
        title: "Legal basis",
        paragraphs: [
          "Taking steps at your request prior to entering into a contract when you ask for a service (art. 6.1.b GDPR) and your consent when you write about anything else (art. 6.1.a GDPR), which you may withdraw at any time.",
        ],
      },
      {
        title: "Retention",
        paragraphs: [
          "Data is kept for as long as needed to handle your request and, afterwards, for the legal periods during which liabilities may arise.",
        ],
      },
      {
        title: "Recipients",
        paragraphs: [
          "No data is shared with third parties unless required by law. The web hosting (Hostinger), email (Google) and visit statistics (Umami) providers act as data processors. Google may process data outside the European Economic Area with the safeguards set out in the GDPR, such as the EU-US Data Privacy Framework.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          `You can exercise your rights of access, rectification, erasure, objection, restriction of processing and portability by writing to ${email}. If you believe they have not been properly addressed, you can lodge a complaint with the Spanish Data Protection Agency (www.aepd.es).`,
          spanishPrevails,
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie policy",
    description: "Information about the use of cookies on this site.",
    sections: [
      {
        title: "Use of cookies",
        paragraphs: [
          "This site does not use its own or third-party cookies for analytics, advertising or personalisation. That is why no cookie banner is shown.",
          "Only technical cookies strictly necessary for the hosting to work might be used, which are exempt from consent under article 22.2 of the LSSI-CE.",
        ],
      },
      {
        title: "Cookieless visit statistics",
        paragraphs: [
          "Visits are counted with Umami, which uses no cookies and stores nothing in your browser. More details in the privacy policy.",
        ],
      },
      {
        title: "Language preference",
        paragraphs: [
          "If you change the language with the selector, your browser stores that choice (local storage, key “lang”) to show you the same language on your next visit. It is a preference you request, it does not identify anyone, it is never sent to any server and it is exempt from consent under article 22.2 of the LSSI-CE. You can delete it from your browser settings.",
        ],
      },
      {
        title: "Links to other sites",
        paragraphs: [
          "When you follow a link to social networks, media outlets or shops, those sites may set their own cookies, governed by their policies.",
          spanishPrevails,
        ],
      },
    ],
  },
};
