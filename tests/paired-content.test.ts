import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { serviceEntrySchema, faqEntrySchema } from '../src/data/pairedContentSchema.ts';
import { validatePairedContent } from '../src/data/validatePairedContent.ts';

describe('Paired Content Schema & Validation', () => {
  const validService = {
    id: 'test-service',
    title: { id: 'Layanan Uji', en: 'Test Service' },
    description: { id: 'Deskripsi uji', en: 'Test description' },
    details: { id: ['Detail 1'], en: ['Detail 1'] },
    image: '',
    image_alt: { id: '', en: '' },
    icon: 'bank' as const,
    order: 1,
    featured: false,
    published: true
  };

  const validFaq = {
    id: 'test-faq',
    question: { id: 'Pertanyaan uji?', en: 'Test question?' },
    answer: { id: 'Jawaban uji.', en: 'Test answer.' },
    order: 1,
    published: true
  };

  it('validates a correct service entry', () => {
    const parsed = serviceEntrySchema.parse(validService);
    assert.equal(parsed.id, 'test-service');
    assert.equal(parsed.title.id, 'Layanan Uji');
    assert.equal(parsed.title.en, 'Test Service');
  });

  it('rejects service with invalid id pattern', () => {
    assert.throws(() => {
      serviceEntrySchema.parse({ ...validService, id: 'INVALID_ID!' });
    });
  });

  it('rejects service with image but missing alt text in strict mode', () => {
    assert.throws(() => {
      serviceEntrySchema.parse({
        ...validService,
        image: '/images/bank-mini/sample.jpg',
        image_alt: { id: '', en: '' }
      });
    });
  });

  it('validates a correct FAQ entry', () => {
    const parsed = faqEntrySchema.parse(validFaq);
    assert.equal(parsed.id, 'test-faq');
    assert.equal(parsed.question.id, 'Pertanyaan uji?');
    assert.equal(parsed.question.en, 'Test question?');
  });

  it('validatePairedContent accepts unique IDs and orders', () => {
    const services = [
      { id: 'srv-1', order: 1, published: true, featured: true },
      { id: 'srv-2', order: 2, published: true, featured: false }
    ];
    const faqs = [
      { id: 'faq-1', order: 1, published: true },
      { id: 'faq-2', order: 2, published: true }
    ];
    assert.doesNotThrow(() => validatePairedContent(services, faqs));
  });

  it('validatePairedContent rejects duplicate service IDs', () => {
    const services = [
      { id: 'srv-dup', order: 1, published: true },
      { id: 'srv-dup', order: 2, published: true }
    ];
    const faqs = [{ id: 'faq-1', order: 1, published: true }];
    assert.throws(
      () => validatePairedContent(services, faqs),
      /Service IDs must be unique/
    );
  });

  it('validatePairedContent rejects duplicate service display orders', () => {
    const services = [
      { id: 'srv-1', order: 1, published: true },
      { id: 'srv-2', order: 1, published: true }
    ];
    const faqs = [{ id: 'faq-1', order: 1, published: true }];
    assert.throws(
      () => validatePairedContent(services, faqs),
      /Service display orders must be unique/
    );
  });

  it('validatePairedContent rejects multiple published featured services', () => {
    const services = [
      { id: 'srv-1', order: 1, published: true, featured: true },
      { id: 'srv-2', order: 2, published: true, featured: true }
    ];
    const faqs = [{ id: 'faq-1', order: 1, published: true }];
    assert.throws(
      () => validatePairedContent(services, faqs),
      /Only one published service can be featured/
    );
  });

  it('validatePairedContent rejects empty service collection', () => {
    const services: Array<{ id: string; order: number; published: boolean }> = [];
    const faqs = [{ id: 'faq-1', order: 1, published: true }];
    assert.throws(
      () => validatePairedContent(services, faqs),
      /At least 1 service entry is required/
    );
  });
});
