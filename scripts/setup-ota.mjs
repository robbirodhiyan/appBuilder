import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
for (const name of ['expo-updates', 'expo-network']) {
  if (!pkg.dependencies?.[name]) {
    throw new Error(`Dependensi ${name} belum terpasang. Jalankan: npx expo install expo-updates expo-network`);
  }
}
const files = [
  ['ota-center.ts.txt', 'src/services/ota-center.ts'],
  ['startup-ota-dialog.tsx.txt', 'src/components/startup-ota-dialog.tsx'],
  ['ota-update-card.tsx.txt', 'src/components/ota-update-card.tsx'],
];
const layoutPath = path.join(ROOT, 'src/app/_layout.tsx');
const settingsPath = path.join(ROOT, 'src/app/(tabs)/settings.tsx');
let layout = fs.readFileSync(layoutPath, 'utf8');
let settings = fs.readFileSync(settingsPath, 'utf8');
if (!layout.includes('<StartupOtaDialog')) {
  if (!layout.includes('<AutoUpdateChecker />')) throw new Error('Root layout tidak kompatibel. Source tidak diubah.');
  layout = layout.replace("import AutoUpdateChecker from '@/components/auto-update-checker';", "import StartupOtaDialog from '@/components/startup-ota-dialog';");
  layout = layout.replace('<AutoUpdateChecker />', '<StartupOtaDialog />');
}
if (!settings.includes('<OtaUpdateCard')) {
  if (!settings.includes('<AppUpdateCard />')) throw new Error('Settings tidak kompatibel. Source tidak diubah.');
  settings = "import OtaUpdateCard from '@/components/ota-update-card';\n" + settings;
  settings = settings.replace('<AppUpdateCard />', '<OtaUpdateCard />\n        <AppUpdateCard />');
}
// All structural checks above succeed before writing files.
for (const [from, to] of files) {
  const dest = path.join(ROOT, to);
  if (fs.existsSync(dest)) continue;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'scripts/ota-templates', from), dest);
}
fs.writeFileSync(layoutPath, layout);
fs.writeFileSync(settingsPath, settings);
console.log('OTA components enabled. Run npm run validate; EAS init and eas update:configure still required.');
