import { existsSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const publicRoot = resolve(process.cwd(), 'public');
const uploadLimit = 5 * 1024 * 1024;

export function validateContentMedia(paths: string[]) {
  for (const publicPath of new Set(paths.filter(Boolean))) {
    const filePath = resolve(publicRoot, `.${publicPath}`);
    if (!filePath.startsWith(`${publicRoot}${sep}`)) {
      throw new Error(`Content media path must stay inside public/: ${publicPath}`);
    }
    if (!existsSync(filePath)) {
      throw new Error(`Content references a missing image: ${publicPath}`);
    }
    if (statSync(filePath).size > uploadLimit) {
      throw new Error(`Content image exceeds the 5 MB upload limit: ${publicPath}`);
    }
  }
}
