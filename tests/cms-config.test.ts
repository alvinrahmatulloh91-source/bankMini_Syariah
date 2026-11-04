import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import yaml from 'yaml';

interface CMSField {
  name: string;
  label?: string;
  widget?: string;
  required?: boolean;
  default?: unknown;
  fields?: CMSField[];
  field?: CMSField;
}

interface CMSCollection {
  name: string;
  files?: Array<{ name: string; file: string; fields: CMSField[] }>;
  fields?: CMSField[];
  folder?: string;
}

describe('Decap CMS Configuration Integrity', () => {
  const configFile = fs.readFileSync('public/admin/config.yml', 'utf-8');
  const config = yaml.parse(configFile);

  it('verifies turbo-github backend and site ID', () => {
    assert.equal(config.backend.name, 'turbo-github');
    assert.equal(config.backend.turbo_site_id, '91bdd6ab-6820-4e2f-8de1-1c23b7d6f065');
    assert.equal(config.backend.branch, 'main');
  });

  it('verifies publish_mode is editorial_workflow', () => {
    assert.equal(config.publish_mode, 'editorial_workflow');
  });

  it('verifies media paths', () => {
    assert.equal(config.media_folder, 'public/images/bank-mini');
    assert.equal(config.public_folder, '/images/bank-mini');
  });

  it('verifies all 5 collections exist', () => {
    const collections = config.collections.map((c: CMSCollection) => c.name);
    assert.deepEqual(collections, [
      'site-content',
      'services',
      'faqs',
      'room-gallery',
      'activity-documentation'
    ]);
  });

  function getCmsKeys(fields: CMSField[], prefix = ''): string[] {
    const keys: string[] = [];
    for (const field of fields) {
      const fullPath = prefix ? `${prefix}.${field.name}` : field.name;
      keys.push(fullPath);
      if (field.fields) {
        keys.push(...getCmsKeys(field.fields, fullPath));
      }
    }
    return keys;
  }

  function getDataKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    const keys: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${k}` : k;
      keys.push(fullPath);
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        keys.push(...getDataKeys(v as Record<string, unknown>, fullPath));
      } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) {
        keys.push(...getDataKeys(v[0] as Record<string, unknown>, fullPath));
      }
    }
    return keys;
  }

  it('ensures id.json matches CMS fields exactly', () => {
    const siteContent = config.collections.find((c: CMSCollection) => c.name === 'site-content');
    const idFile = siteContent.files.find((f: { name: string }) => f.name === 'indonesia');
    const idData = JSON.parse(fs.readFileSync('src/data/id.json', 'utf-8'));

    const cmsKeys = new Set(getCmsKeys(idFile.fields));
    const dataKeys = new Set(getDataKeys(idData));

    assert.deepEqual(cmsKeys, dataKeys, 'id.json keys must match CMS fields exactly');
  });

  it('ensures en.json matches CMS fields exactly', () => {
    const siteContent = config.collections.find((c: CMSCollection) => c.name === 'site-content');
    const enFile = siteContent.files.find((f: { name: string }) => f.name === 'english');
    const enData = JSON.parse(fs.readFileSync('src/data/en.json', 'utf-8'));

    const cmsKeys = new Set(getCmsKeys(enFile.fields));
    const dataKeys = new Set(getDataKeys(enData));

    assert.deepEqual(cmsKeys, dataKeys, 'en.json keys must match CMS fields exactly');
  });

  it('marks optional site-content lists optional in both language forms', () => {
    const siteContent = config.collections.find((c: CMSCollection) => c.name === 'site-content') as CMSCollection & {
      files: Array<{ name: string; file: string; fields: CMSField[] }>;
    };
    const optionalLists = [
      ['about', 'timeline'],
      ['process', 'steps'],
      ['advantages', 'items'],
      ['contact', 'people']
    ];

    for (const file of siteContent.files) {
      for (const path of optionalLists) {
        let fields = file.fields;
        let field: CMSField | undefined;
        for (const name of path) {
          field = fields.find((candidate) => candidate.name === name);
          assert.ok(field, `${file.name}.${path.join('.')} must exist`);
          fields = field.fields ?? [];
        }
        assert.equal(field?.widget, 'list', `${file.name}.${path.join('.')} must be a list`);
        assert.equal(field?.required, false, `${file.name}.${path.join('.')} must be optional`);
      }
    }
  });

  it('leaves only the defaulted advantage icon as a required site-content leaf', () => {
    const siteContent = config.collections.find((c: CMSCollection) => c.name === 'site-content') as CMSCollection & {
      files: Array<{ name: string; file: string; fields: CMSField[] }>;
    };

    function collectLeaves(fields: CMSField[]): CMSField[] {
      return fields.flatMap((field) => {
        const children = field.fields ?? (field.field ? [field.field] : []);
        if (children.length === 0) return [field];
        return collectLeaves(children);
      });
    }

    for (const file of siteContent.files) {
      const requiredLeaves = collectLeaves(file.fields)
        .filter((field) => field.required !== false)
        .map((field) => field.name);

      assert.deepEqual(requiredLeaves, ['icon'], `${file.name} should require only its defaulted icon leaf`);
      const advantages = file.fields.find((field) => field.name === 'advantages');
      const items = advantages?.fields?.find((field) => field.name === 'items');
      const icon = items?.fields?.find((field) => field.name === 'icon');
      assert.equal(icon?.widget, 'select');
      assert.equal(icon?.default, 'sharia');
    }
  });
});
