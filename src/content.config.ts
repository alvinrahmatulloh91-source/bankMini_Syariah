import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { isDecapDraftBuild } from './data/contentValidationMode.ts';
import { faqEntrySchema, serviceEntrySchema } from './data/pairedContentSchema.ts';

const contentText = isDecapDraftBuild
  ? z.preprocess((value) => value ?? '', z.string().trim())
  : z.string().trim().min(1);
const localizedText = z.preprocess((value) => value ?? { id: '', en: '' }, z.object({
  id: contentText,
  en: contentText
}));
const imagePattern = /^$|^\/images\/bank-mini\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:jpe?g|png|webp)$/i;
const imagePath = isDecapDraftBuild
  ? z.preprocess((value) => value ?? '', z.string().trim().regex(imagePattern, 'Use an image under public/images/bank-mini in JPG, PNG, or WebP format.'))
  : z.string().trim().regex(/^\/images\/bank-mini\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:jpe?g|png|webp)$/i, 'Use an image under public/images/bank-mini in JPG, PNG, or WebP format.');
const dimension = isDecapDraftBuild
  ? z.preprocess((value) => value === '' || value == null ? 0 : value, z.number().int().min(0).max(10000))
  : z.number().int().positive().max(10000);
const date = isDecapDraftBuild
  ? z.preprocess((value) => value ?? '', z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/))
  : z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

function requirePublishedFields<T extends { published: boolean }>(schema: z.ZodType<T>, fields: (entry: T) => string[]) {
  return schema.superRefine((entry, context) => {
    if (isDecapDraftBuild || !entry.published) return;
    if (fields(entry).some((value) => !value.trim())) {
      context.addIssue({ code: 'custom', message: 'Published entries must have complete content.' });
    }
  });
}

const roomGallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/room-gallery' }),
  schema: requirePublishedFields(z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: localizedText,
    description: localizedText,
    alt: localizedText,
    category: contentText,
    image: imagePath,
    width: dimension,
    height: dimension,
    order: z.number().int().default(0),
    featured: z.boolean().default(false),
    published: z.boolean().default(false)
  }), (entry) => [entry.title.id, entry.title.en, entry.description.id, entry.description.en, entry.alt.id, entry.alt.en, entry.category, entry.image, String(entry.width || ''), String(entry.height || '')])
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
  schema: serviceEntrySchema
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faqs' }),
  schema: faqEntrySchema
});

const activityDocumentation = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/activities' }),
  schema: requirePublishedFields(z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: localizedText,
    description: localizedText,
    alt: localizedText,
    date,
    category: contentText,
    image: imagePath,
    width: dimension,
    height: dimension,
    order: z.number().int().default(0),
    published: z.boolean().default(false),
    identifiableStudents: z.boolean().default(false),
    permissionConfirmed: z.boolean().default(false)
  }).refine((activity) => isDecapDraftBuild || !activity.published || !activity.identifiableStudents || activity.permissionConfirmed, {
    message: 'Confirm photo permission before publishing identifiable students.',
    path: ['permissionConfirmed']
  }), (entry) => [entry.title.id, entry.title.en, entry.description.id, entry.description.en, entry.alt.id, entry.alt.en, entry.date, entry.category, entry.image, String(entry.width || ''), String(entry.height || '')])
});

export const collections = { roomGallery, activityDocumentation, services, faqs };
