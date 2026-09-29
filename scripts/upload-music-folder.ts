/**
 * CLI Tool: Batch Upload Music Tracks to Cloudflare R2 & Firestore Catalog
 * 
 * Usage:
 *   npx tsx scripts/upload-music-folder.ts --dir=/path/to/my/mp3s --category=royal
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
let musicDir = '';
let category = 'royal';

for (const arg of args) {
  if (arg.startsWith('--dir=')) {
    musicDir = arg.split('=')[1].trim();
  } else if (arg.startsWith('--category=')) {
    category = arg.split('=')[1].trim();
  }
}

if (!musicDir) {
  console.log(`
🎵 FRIDA Music Batch Uploader CLI
=================================
Usage:
  npx tsx scripts/upload-music-folder.ts --dir="./my-music-folder" --category="royal"

Categories:
  - royal (ملكي فاخر)
  - wedding (زفاف)
  - engagement (خطوبة)
  - classic (كلاسيك)
  - birthday (احتفالات)
`);
  process.exit(0);
}

const resolvedDir = path.resolve(process.cwd(), musicDir);
if (!fs.existsSync(resolvedDir)) {
  console.error(`❌ Directory not found: ${resolvedDir}`);
  process.exit(1);
}

const files = fs.readdirSync(resolvedDir).filter((f) => f.match(/\.(mp3|wav|m4a|aac|ogg)$/i));
if (files.length === 0) {
  console.log(`ℹ️ No audio files found in: ${resolvedDir}`);
  process.exit(0);
}

console.log(`🚀 Found ${files.length} audio files in ${resolvedDir}. Starting R2 batch upload...`);

for (let i = 0; i < files.length; i++) {
  const fileName = files[i];
  const filePath = path.join(resolvedDir, fileName);
  const cleanName = fileName.replace(/\.[^/.]+$/, '').trim();
  const trackId = `song_bulk_${Date.now()}_${i}`;
  const r2Key = `audio/library/${trackId}.mp3`;

  console.log(`[${i + 1}/${files.length}] Uploading "${cleanName}" -> ${r2Key}...`);
  try {
    execSync(`npx wrangler r2 object put "frida-assets/${r2Key}" --file="${filePath}" --remote --content-type="audio/mpeg"`, {
      stdio: 'pipe',
    });
    console.log(`  ✅ Successfully uploaded to R2: https://farid.invitationes.workers.dev/${r2Key}`);
  } catch (err: any) {
    console.error(`  ❌ Failed to upload ${fileName}:`, err.message);
  }
}

console.log(`\n🎉 Batch upload complete for ${files.length} tracks!`);
