import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localizedText = z.object({
  id: z.string().trim().min(1),
  en: z.string().trim().min(1)
});

const roomGallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/room-gallery' }),
  schema: z.object({
    title: localizedText,
    description: localizedText,
    alt: localizedText,
    category: z.string().trim().min(1),
    image: z.string().trim().regex(/^\/images\/bank-mini\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:jpe?g|png|webp|avif)$/i, 'Use an image in public/images/bank-mini with a supported extension.'),
    width: z.number().int().positive().max(10000),
    height: z.number().int().positive().max(10000),
    order: z.number().int().default(0),
    featured: z.boolean().default(false),
    published: z.boolean().default(false)
  })
});

export const collections = { roomGallery };
