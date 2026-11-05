import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { siteContentSchema } from '../src/data/siteContentSchema.ts';
import { serviceEntrySchema, faqEntrySchema } from '../src/data/pairedContentSchema.ts';

describe('Site Content & Collections Integrity', () => {
  const rawId = JSON.parse(fs.readFileSync('src/data/id.json', 'utf-8'));
  const rawEn = JSON.parse(fs.readFileSync('src/data/en.json', 'utf-8'));

  it('validates src/data/id.json with siteContentSchema', () => {
    assert.doesNotThrow(() => {
      const parsed = siteContentSchema.parse(rawId);
      assert.equal(parsed.branding.school_name, 'SMKN 1 Bantul');
    });
  });

  it('validates src/data/en.json with siteContentSchema', () => {
    assert.doesNotThrow(() => {
      const parsed = siteContentSchema.parse(rawEn);
      assert.equal(parsed.branding.school_name, 'SMKN 1 Bantul');
    });
  });

  it('accepts empty optional site-content lists', () => {
    const contentWithEmptyOptionalLists = {
      ...rawId,
      about: { ...rawId.about, timeline: [] },
      process: { ...rawId.process, steps: [] },
      advantages: { ...rawId.advantages, items: [] },
      contact: { ...rawId.contact, people: [] }
    };

    assert.doesNotThrow(() => siteContentSchema.parse(contentWithEmptyOptionalLists));
  });

  it('accepts optional hero stats metadata', () => {
    const contentWithHeroStats = {
      ...rawId,
      hero: {
        ...rawId.hero,
        stats: [
          { value: '3.5K+', label: 'Transaksi', detail: 'Per bulan' },
          { value: '100%', label: 'Syariah', detail: 'Halal dan aman' },
          { value: '24/7', label: 'Pembelajaran', detail: 'Praktek siswa' }
        ]
      }
    };

    assert.doesNotThrow(() => siteContentSchema.parse(contentWithHeroStats));
  });

  it('continues to require essential site copy', () => {
    const contentWithoutHeroHeadline = {
      ...rawId,
      hero: { ...rawId.hero, headline: '' }
    };

    assert.throws(() => siteContentSchema.parse(contentWithoutHeroHeadline));
  });

  it('rejects invalid WhatsApp phone numbers in contact', () => {
    const invalidData = {
      ...rawId,
      contact: {
        ...rawId.contact,
        people: [{ name: 'Test', phone: '0812abc345' }]
      }
    };
    assert.throws(() => siteContentSchema.parse(invalidData));
  });

  it('rejects non-HTTPS map links', () => {
    const invalidData = {
      ...rawId,
      location: {
        ...rawId.location,
        map_link: 'http://insecure-map-link.com'
      }
    };
    assert.throws(() => siteContentSchema.parse(invalidData));
  });

  it('rejects invalid email formats', () => {
    const invalidData = {
      ...rawId,
      contact: {
        ...rawId.contact,
        school_email: 'not-an-email'
      }
    };
    assert.throws(() => siteContentSchema.parse(invalidData));
  });

  it('validates all service collection files in src/content/services/', () => {
    const servicesDir = 'src/content/services';
    const files = fs.readdirSync(servicesDir).filter((file) => file.endsWith('.json'));
    assert.ok(files.length >= 1, 'Should have at least 1 service file');
    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(servicesDir, file), 'utf-8'));
      assert.doesNotThrow(() => serviceEntrySchema.parse(content), `Failed parsing service ${file}`);
    }
  });

  it('validates all FAQ collection files in src/content/faqs/', () => {
    const faqsDir = 'src/content/faqs';
    const files = fs.readdirSync(faqsDir).filter((file) => file.endsWith('.json'));
    assert.ok(files.length >= 1, 'Should have at least 1 FAQ file');
    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(faqsDir, file), 'utf-8'));
      assert.doesNotThrow(() => faqEntrySchema.parse(content), `Failed parsing FAQ ${file}`);
    }
  });
});
