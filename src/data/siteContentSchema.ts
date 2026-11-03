import { z } from 'astro:content';

const text = z.string().trim().min(1);

export const siteContentSchema = z.object({
  nav: z.object({
    home: text,
    about: text,
    services: text,
    explore: text,
    advantages: text,
    location: text,
    contact: text
  }),
  hero: z.object({ label: text, headline: text, subheadline: text, cta_primary: text, cta_secondary: text }),
  about: z.object({
    label: text,
    headline: text,
    history_narration: text,
    timeline: z.array(z.object({ year: text, title: text, description: text })).min(1),
    visi: z.object({ title: text, text }),
    misi: z.object({ title: text, text }),
    motto: z.object({ title: text, text })
  }),
  services: z.object({
    label: text,
    headline: text,
    subheadline: text,
    bsi_agen: z.object({ title: text, description: text, items: z.array(text) }),
    tabungan: z.object({ title: text, description: text, features: z.array(text) })
  }),
  space: z.object({
    eyebrow: text,
    title: text,
    description: text,
    roomTitle: text,
    roomDescription: text,
    learningLabel: text,
    learningTitle: text,
    learningText: text,
    locationLabel: text,
    galleryTitle: text,
    galleryDescription: text,
    emptyTitle: text,
    emptyText: text,
    categories: text,
    requestedCategories: z.array(text),
    galleryFilterLabel: text,
    allCategories: text,
    openImage: text,
    close: text,
    previous: text,
    next: text,
    categoryDisclaimer: text
  }),
  process: z.object({ label: text, headline: text, steps: z.array(z.object({ title: text, description: text })).min(1) }),
  advantages: z.object({ label: text, headline: text, items: z.array(z.object({ title: text, description: text })) }),
  operation: z.object({ label: text, title: text, description: text, schedule: text }),
  location: z.object({ label: text, headline: text, address: text, instruction: text }),
  contact: z.object({
    headline: text,
    whatsapp_message: text,
    people: z.array(z.object({ name: text, phone: z.string().regex(/^\d{8,15}$/) }))
  }),
  faq: z.object({ label: text, headline: text, description: text, items: z.array(z.object({ q: text, a: text })) }),
  footer: z.object({ motto: text, copyright: text })
});

export type SiteContent = z.infer<typeof siteContentSchema>;
