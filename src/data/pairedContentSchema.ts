import { z } from 'astro/zod';
import { isDecapDraftBuild } from './contentValidationMode.ts';

const contentText = isDecapDraftBuild
  ? z.preprocess((value) => value ?? '', z.string().trim())
  : z.string().trim().min(1);

const optionalText = z.preprocess((value) => value ?? '', z.string().trim());

const localizedText = z.preprocess((value) => value ?? { id: '', en: '' }, z.object({
  id: contentText,
  en: contentText
}));

const localizedOptionalText = z.preprocess((value) => value ?? { id: '', en: '' }, z.object({
  id: optionalText,
  en: optionalText
}));

const localizedAltText = z.preprocess((value) => value ?? { id: '', en: '' }, z.object({
  id: z.string().trim(),
  en: z.string().trim()
}));

const localizedList = z.preprocess((value) => value ?? { id: [], en: [] }, z.object({
  id: z.array(z.string().trim()).default([]),
  en: z.array(z.string().trim()).default([])
}));

const stableId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const mediaPath = z.preprocess((value) => value ?? '', z.string().trim().regex(
  /^$|^\/images\/bank-mini\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:jpe?g|png|webp)$/i,
  'Use a .jpg, .png, or .webp image under public/images/bank-mini.'
));
const order = isDecapDraftBuild
  ? z.preprocess((value) => value === '' || value == null ? 0 : value, z.number().int())
  : z.number().int();

export const serviceEntrySchema = z.object({
  id: stableId,
  title: localizedText,
  description: localizedOptionalText,
  details: localizedList,
  image: mediaPath,
  image_alt: localizedAltText,
  icon: z.enum(['bank', 'savings', 'service', 'transfer', 'payment']).default('bank'),
  order,
  featured: z.boolean().default(false),
  published: z.boolean().default(false)
}).superRefine((service, context) => {
  if (!isDecapDraftBuild && service.published) {
    if (!service.title.id.trim() || !service.title.en.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Published services require title in both languages.',
        path: ['title']
      });
    }
    if (service.image && (!service.image_alt.id.trim() || !service.image_alt.en.trim())) {
      context.addIssue({
        code: 'custom',
        message: 'Service images require alternative text in both languages.',
        path: ['image_alt']
      });
    }
  }
});

export const faqEntrySchema = z.object({
  id: stableId,
  question: localizedText,
  answer: localizedText,
  order,
  published: z.boolean().default(false)
});

export type ServiceEntry = z.infer<typeof serviceEntrySchema>;
export type FaqEntry = z.infer<typeof faqEntrySchema>;
