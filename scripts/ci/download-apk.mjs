import fs from 'node:fs';
import path from 'node:path';
const version = process.env.VERSION;
const prefix = process.env.APK_PREFIX;
if (!/^\d+\.\d+\.\d+$/.test(version ?? '') || !/^[a-z][a-z0-9_-]*$/.test(prefix ?? '')) {
  throw new Error('Invalid version or APK prefix');
}
const json = JSON.parse(fs.readFileSync('eas-build.json', 'utf8'));
const build = Array.isArray(json) ? json[0] : json;
if (!build || String(build.status).toUpperCase() !== 'FINISHED') throw new Error('EAS Build did not finish');
const url = build.artifacts?.buildUrl ?? build.artifacts?.applicationArchiveUrl;
if (typeof url !== 'string' || !url.startsWith('https://')) throw new Error('Missing APK HTTPS URL');
const response = await fetch(url);
if (!response.ok) throw new Error(`APK download failed HTTP ${response.status}`);
const bytes = Buffer.from(await response.arrayBuffer());
if (bytes.length < 1024 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw new Error('Invalid APK archive');
fs.mkdirSync('dist', { recursive: true });
const output = path.join('dist', `${prefix}-v${version}.apk`);
fs.writeFileSync(output, bytes);
console.log(`Downloaded ${output} (${bytes.length} bytes)`);
