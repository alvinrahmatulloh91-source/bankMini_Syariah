import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localizedText = z.object({
  id: z.string().trim().min(1),
  en: z.string().trim().min(1)
});
const imagePath = z.string().trim().regex(/^\/images\/bank-mini\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:jpe?g|png|webp)$/i, 'Use an image under public/images/bank-mini in JPG, PNG, or WebP format.');

const roomGallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/room-gallery' }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: localizedText,
    description: localizedText,
    alt: localizedText,
    category: z.string().trim().min(1),
    image: imagePath,
    width: z.number().int().positive().max(10000),
    height: z.number().int().positive().max(10000),
    order: z.number().int().default(0),
    featured: z.boolean().default(false),
    published: z.boolean().default(false)
  })
});

const activityDocumentation = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/activities' }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: localizedText,
    description: localizedText,
    alt: localizedText,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    category: z.string().trim().min(1),
    image: imagePath,
    width: z.number().int().positive().max(10000),
    height: z.number().int().positive().max(10000),
    order: z.number().int().default(0),
    published: z.boolean().default(false),
    identifiableStudents: z.boolean().default(false),
    permissionConfirmed: z.boolean().default(false)
  }).refine((activity) => !activity.published || !activity.identifiableStudents || activity.permissionConfirmed, {
    message: 'Confirm photo permission before publishing identifiable students.',
    path: ['permissionConfirmed']
  })
});

export const collections = { roomGallery, activityDocumentation };
