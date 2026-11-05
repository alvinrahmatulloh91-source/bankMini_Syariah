import { z } from 'astro/zod';
import { isDecapDraftBuild } from './contentValidationMode.ts';

const text = isDecapDraftBuild
  ? z.preprocess((value) => value ?? '', z.string().trim())
  : z.string().trim().min(1);

const optionalText = z.preprocess((value) => value ?? '', z.string().trim());

const mediaPath = z.preprocess((value) => value ?? '', z.string().trim().regex(/^$|^\/images\/bank-mini\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:jpe?g|png|webp)$/i, 'Use a .jpg, .png, or .webp image under public/images/bank-mini.'));

const secureUrl = z.preprocess((value) => value ?? '', z.union([z.literal(''), z.url().refine((value) => value.startsWith('https://'), 'Use an HTTPS URL.') ]));

const advantageIcon = z.enum(['sharia', 'education', 'location', 'fees']);

export const siteContentSchema = z.object({
  branding: z.object({
    organization_name: text,
    school_name: text
  }),
  nav: z.object({
    home: text,
    about: text,
    services: text,
    explore: text,
    advantages: text,
    location: text,
    contact: text
  }),
  hero: z.object({
    label: optionalText,
    headline: text,
    subheadline: optionalText,
    cta_primary: optionalText,
    cta_secondary: optionalText,
    stats: z.array(z.object({
      value: text,
      label: text,
      detail: optionalText
    })).default([]),
    image: mediaPath,
    image_alt: optionalText
  }).refine((hero) => isDecapDraftBuild || !hero.image || hero.image_alt.trim().length > 0, 'Hero image requires alternative text.'),
  about: z.object({
    label: optionalText,
    headline: text,
    history_narration: optionalText,
    timeline: z.array(z.object({
      year: text,
      title: text,
      description: optionalText
    })).default([]),
    visi: z.object({ title: optionalText, text: optionalText }),
    misi: z.object({ title: optionalText, text: optionalText }),
    motto: z.object({ title: optionalText, text: optionalText })
  }),
  services: z.object({
    label: optionalText,
    headline: text,
    subheadline: optionalText,
    cta: optionalText
  }),
  space: z.object({
    eyebrow: optionalText,
    title: text,
    description: optionalText,
    roomTitle: optionalText,
    roomDescription: optionalText,
    learningLabel: optionalText,
    learningTitle: optionalText,
    learningText: optionalText,
    locationLabel: optionalText,
    galleryTitle: optionalText,
    galleryDescription: optionalText,
    emptyTitle: optionalText,
    emptyText: optionalText,
    categories: optionalText,
    requestedCategories: z.array(optionalText).default([]),
    galleryFilterLabel: optionalText,
    allCategories: optionalText,
    openImage: optionalText,
    close: optionalText,
    previous: optionalText,
    next: optionalText,
    categoryDisclaimer: optionalText
  }),
  process: z.object({
    label: optionalText,
    headline: text,
    steps: z.array(z.object({
      title: text,
      description: optionalText
    })).default([])
  }),
  advantages: z.object({
    label: optionalText,
    headline: text,
    items: z.array(z.object({
      title: text,
      description: optionalText,
      icon: advantageIcon.default('sharia')
    })).default([])
  }),
  operation: z.object({
    label: optionalText,
    title: text,
    description: optionalText,
    schedule: optionalText,
    image: mediaPath,
    image_alt: optionalText,
    practice_label: optionalText,
    practice_title: optionalText
  }).refine((operation) => isDecapDraftBuild || !operation.image || operation.image_alt.trim().length > 0, 'Operation image requires alternative text.'),
  location: z.object({
    label: optionalText,
    headline: text,
    address: text,
    instruction: optionalText,
    map_link: secureUrl
  }),
  contact: z.object({
    headline: text,
    whatsapp_message: optionalText,
    school_address: optionalText,
    school_email: z.preprocess((value) => value ?? '', z.union([z.literal(''), z.email()])),
    people: z.array(z.object({
      name: text,
      phone: isDecapDraftBuild
        ? z.preprocess((value) => value ?? '', z.union([z.literal(''), z.string().regex(/^\d{8,15}$/)]))
        : z.string().regex(/^\d{8,15}$/)
    })).default([])
  }),
  faq: z.object({
    label: optionalText,
    headline: text,
    description: optionalText
  }),
  footer: z.object({
    motto: optionalText,
    copyright: text
  })
});

export type SiteContent = z.infer<typeof siteContentSchema>;
