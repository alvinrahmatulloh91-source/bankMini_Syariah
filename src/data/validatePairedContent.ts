import { isDecapDraftBuild } from './contentValidationMode.ts';

interface OrderedEntry {
  id: string;
  order: number;
  published: boolean;
  featured?: boolean;
}

function validateCollection(label: string, entries: OrderedEntry[], options: { minimum: number; onePublishedFeatured?: boolean }) {
  const ids = entries.map((entry) => entry.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${label} IDs must be unique.`);
  }

  if (!isDecapDraftBuild && entries.length < options.minimum) {
    throw new Error(`At least ${options.minimum} ${label.toLowerCase()} entry is required for publication.`);
  }

  if (!isDecapDraftBuild) {
    const orders = entries.map((entry) => entry.order);
    if (new Set(orders).size !== orders.length) {
      throw new Error(`${label} display orders must be unique.`);
    }
  }

  if (options.onePublishedFeatured && entries.filter((entry) => entry.featured && entry.published).length > 1) {
    throw new Error('Only one published service can be featured.');
  }
}

export function validatePairedContent(services: OrderedEntry[], faqs: OrderedEntry[]) {
  validateCollection('Service', services, { minimum: 1, onePublishedFeatured: true });
  validateCollection('FAQ', faqs, { minimum: 1 });
}
