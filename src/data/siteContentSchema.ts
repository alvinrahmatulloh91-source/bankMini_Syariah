import { z } from 'astro:content';

const text = z.string().trim().min(1);
const mediaPath = z.preprocess((value) => value ?? '', z.string().trim().regex(/^$|^\/images\/bank-mini\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:jpe?g|png|webp)$/i, 'Use a .jpg, .png, or .webp image under public/images/bank-mini.'));
const optionalText = z.preprocess((value) => value ?? '', z.string());
const secureUrl = z.preprocess((value) => value ?? '', z.union([z.literal(''), z.string().url().refine((value) => value.startsWith('https://'), 'Use an HTTPS URL.') ]));
const stableId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const siteContentSchema = z.object({
  branding: z.object({ organization_name: text, school_name: text }),
  nav: z.object({
    home: text,
    about: text,
    services: text,
    explore: text,
    advantages: text,
    location: text,
    contact: text
  }),
  hero: z.object({ label: text, headline: text, subheadline: text, cta_primary: text, cta_secondary: text, image: mediaPath, image_alt: optionalText }).refine((hero) => !hero.image || hero.image_alt.trim().length > 0, 'Hero image requires alternative text.'),
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
    cta: text,
    items: z.array(z.object({
      id: stableId,
      title: text,
      description: text,
      details: z.array(text),
      image: mediaPath,
      image_alt: optionalText,
      icon: z.enum(['bank', 'savings', 'service', 'transfer', 'payment']),
      order: z.number().int(),
      featured: z.boolean(),
      published: z.boolean()
    }).refine((service) => !service.image || service.image_alt.trim().length > 0, 'Service image requires alternative text.'))
      .refine((items) => new Set(items.map((item) => item.id)).size === items.length, 'Service IDs must be unique.')
      .refine((items) => items.filter((item) => item.featured && item.published).length <= 1, 'Only one published service can be featured.')
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
  location: z.object({ label: text, headline: text, address: text, instruction: text, map_link: secureUrl }),
  contact: z.object({
    headline: text,
    whatsapp_message: text,
    school_address: text,
    school_email: z.string().email(),
    people: z.array(z.object({ name: text, phone: z.string().regex(/^\d{8,15}$/) }))
  }),
  faq: z.object({
    label: text,
    headline: text,
    description: text,
    items: z.array(z.object({ id: stableId, q: text, a: text, order: z.number().int(), published: z.boolean() }))
      .refine((items) => new Set(items.map((item) => item.id)).size === items.length, 'FAQ IDs must be unique.')
  }),
  footer: z.object({ motto: text, copyright: text })
});

export type SiteContent = z.infer<typeof siteContentSchema>;
