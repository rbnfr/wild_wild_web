import type { ServiceId } from "@/content/site";
import type { Dictionary } from "./index";
import { legal } from "@/content/legal/en";

export const en: Dictionary = {
  seo: {
    title: "Mary Granero | Biologist and dog and cat ethologist",
    description:
      "Mary Granero, biologist, dog and cat ethologist and science communicator at Wild Behavior. Author of Lo que la ciencia sabe de tu gato.",
    profession: "Biologist and dog and cat ethologist",
    ogTagline: "Ethology · Dogs and cats",
  },
  common: {
    skipLink: "Skip to content",
    newTab: "(opens in a new tab)",
    backHome: "Back to home",
    language: "Language",
  },
  header: {
    tagline: "Ethology and living together",
    navLabel: "Main navigation",
    menu: "Menu",
    close: "Close",
    cta: "Let’s talk",
    nav: {
      about: "About me",
      services: "Services",
      outreach: "Outreach",
      collaborations: "Collaborations",
    },
  },
  footer: {
    socialsLabel: "Social media",
    legalLabel: "Legal information",
    links: {
      legalNotice: "Legal notice",
      privacy: "Privacy",
      cookies: "Cookies",
    },
  },
  hero: {
    label: "Ethology · Outreach · Pets",
    title: "Understanding them changes how we live together.",
    description:
      "I help multispecies families live together in harmony. Getting to know our furry companions through scientific evidence helps us give them what they need, improving their wellbeing and our life together.",
    primary: "Tell me about your case",
    secondary: "Propose a collaboration",
    imageAlt:
      "Mary Granero crouching beside a black and tan dog in the countryside",
    socialsLabel: "My social media",
    footStart: "A space to understand each other better",
    footEnd: "People, dogs and cats",
    scrollLabel: "Discover more about me",
  },
  about: {
    title: "Behind every behaviour, there is something to understand.",
    cta: "See how I can help",
    photos: {
      label: "Photographs of my work",
      previous: "Previous photograph",
      next: "Next photograph",
      pause: "Stop the automatic slideshow",
      play: "Resume the automatic slideshow",
      position: "{current} of {total}",
      alt: {
        "with-dog": "Mary smiles beside a long-haired brown and white dog",
        "shelter-walk":
          "Walking a black and tan dog on a lead in front of some kennels",
        "event-group": "Group photo of about thirty people at an event",
        "awards-group":
          "Group photo of fourteen badge-wearing people in front of the Edu-Con España 2026 Digital Educators Awards backdrop",
        "book-signature":
          "Mary sticks her tongue out and holds up her book «Lo que la ciencia sabe de tu gato» at a bookstall",
        "wellbeing-conference":
          "Mary seated at a laptop and microphone during an outdoor talk, with her book cover projected behind her",
        "with-cat":
          "Close-up of a tabby and white cat with amber eyes, with Mary peeking out behind it",
      },
    },
    paragraphs: [
      "My passion for science led me to a degree in biology at the University of Murcia. There I found my true calling, **animal behaviour**, which led me to a Master’s in Applied Ethology and Animal-Assisted Intervention.",
      "It was during the master’s that I realised I didn’t want to work with animals, but for them. So I specialised in animal welfare, and during my master’s placement I helped implement environmental enrichment plans at a wildlife recovery centre to improve the animals’ quality of life.",
      "My first job was at a dog boarding centre, improving the welfare of the dogs there and treating behaviour problems in people’s homes. Through this experience I came into contact with the world of pets: I trained as a veterinary technician and began working with an animal shelter, treating behaviour problems in dogs and cats to make their adoption easier and improve their quality of life.",
      "At the same time I began sharing science about animal behaviour in general, and later about dogs and cats, in response to the lack of evidence-based information on social media. This gave me the opportunity to publish a book on feline ethology, «Lo que la ciencia sabe de tu gato» (What science knows about your cat).",
      "Today I keep helping multispecies families live better together, and I try to share rigorous science on social media to counter misinformation.",
    ],
  },
  services: {
    title: "Ethology services.",
    note: "Online consultations, and in-person consultations in the Region of Murcia. For special cases I can travel to the Valencia region and Andalusia, and to the rest of Spain at a higher travel cost. Ask about availability and pricing for your location.",
    items: [
      {
        id: "canine" as ServiceId,
        imageAlt: "Three dogs sitting on the grass in a park",
        title: "Dog ethology",
        description:
          "Advice on behaviour problems, welfare and living together.",
        topics: [
          "Fears and insecurity",
          "Problems living together",
          "Separation-related behaviours",
          "Reactivity",
          "Environmental enrichment",
          "Adapting to changes in their environment",
        ],
        tag: "Ask about my dog",
      },
      {
        id: "feline" as ServiceId,
        imageAlt: "Calico cat lying on the arm of a sofa",
        title: "Cat ethology",
        description:
          "Advice on behaviour problems, welfare and living together.",
        topics: [
          "House soiling",
          "Conflicts between cats",
          "Stress and environmental changes",
          "Environmental enrichment",
          "Settling into a new home",
          "Welfare and living-together issues",
        ],
        tag: "Ask about my cat",
      },
      {
        id: "shelters" as ServiceId,
        imageAlt: "Two German shepherds in a kennel",
        title: "Advice for animal shelters",
        description:
          "Experience in environmental enrichment, handling protocols and advice for animal shelters and dog boarding centres.",
        topics: [],
        tag: "For shelters",
      },
    ],
  },
  outreach: {
    title: "Outreach.",
    socialsTitle: "Social media",
    booksTitle: "Book (in Spanish)",
    pressTitle: "Press (in Spanish)",
    bookCta: "Get your copy",
    printEdition: (pages: number) => `${pages} pages · Print edition`,
    coverAlt: (title: string, author: string) =>
      `Cover of ${title}, by ${author}`,
  },
  socials: {
    instagram: "Animal behaviour and welfare with Wild Behavior",
    tiktok: "Science about dogs, cats and other animals",
    youtube: "Videos to explore ethology",
    facebook: "The Wild Behavior community",
    x: "Ethology and conversation about animal behaviour",
  },
  books: {
    "cat-science":
      "A guide to understanding cats through scientific evidence. Mary brings together what we know about feline communication, behaviour and needs to review common myths and help improve their welfare and life together at home.",
  },
  press: {
    "muy-interesante": "Exclusive reading of a chapter from the book",
    "20-minutos": "News on the book’s publication",
    "vanguardia-maullan": "“Cats almost never meow at each other”",
    "national-geographic": "“Ozempic for cats”",
    "vanguardia-reconciliacion": "“Cats have no tools for reconciliation”",
    tvnoticias:
      "“The relationship between humans and cats did not begin with training or selective breeding”",
  },
  collaborations: {
    title: "Good ideas start with a conversation.",
    description:
      "If you represent a media outlet, a publisher, a brand or an organisation and have a proposal, this is where we meet.",
    tags: [
      "Press and podcasts",
      "Talks and events",
      "Publishing projects",
      "Collaborations",
    ],
    cta: "Send a proposal",
  },
  contact: {
    title: "Tell me what you have in mind.",
    description:
      "For an online consultation or an in-person one (in the Region of Murcia), a project, a talk or any idea you may have, get in touch and let’s talk.",
    privacyNote:
      "The draft is prepared on your device. When you send the email, your data will be used to handle your request. See the details in the",
    privacyLink: "privacy policy",
    form: {
      label: "Contact form",
      note: "Fields marked with * are required. We’ll prepare an email for you to send from your own app; you can also copy it.",
      fields: {
        name: "Name",
        email: "Email",
        company: "Company or organisation",
        phone: "Phone",
      },
      optional: "(optional)",
      reason: "Reason for contact",
      reasonPlaceholder: "Choose a reason",
      message: "Your message",
      messageHelp:
        "Between 20 and 4,000 characters. Please don’t include sensitive data.",
      privacyAccept: "I have read and accept the",
      privacyLink: "privacy policy",
      submit: "Prepare email",
      status: {
        invalid:
          "Please check the highlighted fields before preparing the email.",
        ready: "Draft ready. No email has been sent yet.",
        copied:
          "Draft copied. Paste it into your email, review it and send it from there.",
        copyFailed:
          "The draft couldn’t be copied automatically. It is selected so you can copy it manually.",
      },
      draft: {
        title: "Your email is ready",
        text: "Open it in your app, review the content and press send there. If you don’t have an email app set up, copy the draft into your usual email.",
        open: "Open my email app",
        copy: "Copy draft",
        label: "Draft to copy",
      },
      noscript:
        "To use the form, please enable JavaScript. You can also write directly to",
      errors: {
        nameShort: "Please enter your name.",
        emailInvalid: "Please enter a valid email.",
        tooLong: "The text is too long.",
        controlChars: "Control characters are not allowed.",
        reasonRequired: "Please choose a reason for contact.",
        messageShort: "Please write a message of at least 20 characters.",
        messageChars: "The message contains characters that are not allowed.",
        privacyRequired: "Please accept the privacy policy.",
      },
      mail: {
        to: "To",
        subjectLabel: "Subject",
        subject: "Contact with Mary Granero",
        name: "Name",
        email: "Contact email",
        company: "Company or organisation",
        phone: "Phone",
        reason: "Reason",
        reasons: {
          consulta: "Consultation",
          contratacion: "Hiring",
          evento: "Talk or event",
          prensa: "Press or media",
          editorial: "Publishing project",
          colaboracion: "Brand collaboration",
          otro: "Other",
        },
      },
    },
  },
  notFound: {
    eyebrow: "Page not found",
    title: "Let’s find our way back.",
    text: "The address you opened doesn’t exist.",
  },
  llms: {
    contact: "Contact",
    topics: "Topics",
    contactForm: "Contact form",
    email: "Email",
  },
  legal,
};
