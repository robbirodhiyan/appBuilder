import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const bump = process.argv[2] ?? 'patch';
if (!['patch', 'minor', 'major'].includes(bump)) {
  throw new Error('Versi release hanya boleh patch, minor, atau major.');
}
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const semver = (raw) => {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(raw);
  return match ? match.slice(1).map(Number) : null;
};
const compare = (a, b) => {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
};
const expoJson = read('app.json');
const pkg = read('package.json');
const lock = read('package-lock.json');
const project = read('project.config.json');
let current = semver(expoJson.expo.version);
if (!current) throw new Error('app.json expo.version harus MAJOR.MINOR.PATCH');
const tagList = execFileSync('git', ['tag', '--list', 'v*'], { encoding: 'utf8' }).split(/\r?\n/);
for (const tag of tagList) {
  const parsed = semver(tag);
  if (parsed && compare(parsed, current) > 0) current = parsed;
}
const [major, minor, patch] = current;
const next = bump === 'major' ? [major + 1, 0, 0] : bump === 'minor' ? [major, minor + 1, 0] : [major, minor, patch + 1];
const version = next.join('.');
const prefix = project.release?.apkPrefix;
if (!/^[a-z][a-z0-9_-]*$/.test(prefix ?? '')) throw new Error('release.apkPrefix tidak valid');
if (pkg.version !== expoJson.expo.version || lock.version !== pkg.version) {
  throw new Error('Versi package.json/package-lock.json/app.json tidak sinkron sebelum release');
}
expoJson.expo.version = version;
pkg.version = version;
lock.version = version;
if (lock.packages?.['']) lock.packages[''].version = version;
for (const [name, json] of [['app.json', expoJson], ['package.json', pkg], ['package-lock.json', lock]]) {
  fs.writeFileSync(name, JSON.stringify(json, null, 2) + '\n');
}
if (process.env.GITHUB_OUTPUT) {
  const sanitizedName = String(project.app.name).replace(/[\r\n]/g, ' ').slice(0, 90);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\ntag=v${version}\nprefix=${prefix}\napp_name=${sanitizedName}\n`);
}
console.log(`${bump.toUpperCase()} version → ${version}`);
