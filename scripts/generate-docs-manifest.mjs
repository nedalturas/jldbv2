// scripts/generate-docs-manifest.mjs
import { readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docsDir = join(__dirname, '../public/docs');
const outputPath = join(docsDir, 'manifest.json');

function generateManifest() {
  const files = readdirSync(docsDir).filter(
    file => file.endsWith('.md') && file !== 'README.md'
  );

  writeFileSync(outputPath, JSON.stringify(files, null, 2));
  console.log(`✅ Generated docs manifest with ${files.length} file(s).`);
}

generateManifest();

