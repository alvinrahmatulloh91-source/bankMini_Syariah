import rawEn from './en.json';
import rawId from './id.json';
import { siteContentSchema } from './siteContentSchema';
import { validateContentMedia } from './validateContentMedia';

const id = siteContentSchema.parse(rawId);
const en = siteContentSchema.parse(rawEn);

validateContentMedia([
  id.hero.image,
  en.hero.image,
  id.operation.image,
  en.operation.image,
]);

export const siteContent = { id, en };
