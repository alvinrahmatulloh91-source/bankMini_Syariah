import rawEn from './en.json';
import rawId from './id.json';
import { siteContentSchema } from './siteContentSchema';
import { validateContentMedia } from './validateContentMedia';

const id = siteContentSchema.parse(rawId);
const en = siteContentSchema.parse(rawEn);

function assertPairedEntries(label: string, idEntries: Array<{ id: string; order: number; published: boolean; featured?: boolean }>, enEntries: Array<{ id: string; order: number; published: boolean; featured?: boolean }>) {
  const state = (entries: typeof idEntries) => Object.fromEntries(
    entries.map(({ id, order, published, featured }) => [id, [order, published, featured ?? null]]).sort(([a], [b]) => String(a).localeCompare(String(b)))
  );
  if (JSON.stringify(state(idEntries)) !== JSON.stringify(state(enEntries))) {
    throw new Error(`Indonesian and English ${label} entries must have matching IDs, order, and publication state.`);
  }
}

assertPairedEntries('service', id.services.items, en.services.items);
assertPairedEntries('FAQ', id.faq.items, en.faq.items);
validateContentMedia([
  id.hero.image,
  en.hero.image,
  ...id.services.items.map((item) => item.image),
  ...en.services.items.map((item) => item.image)
]);

export const siteContent = { id, en };
