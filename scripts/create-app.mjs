
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ============================================================
// DEYKIT BY DEBIYAN
// PROJECT GENERATOR
// ============================================================

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const args = process.argv.slice(2);

// ============================================================
// 1. HELPERS
// ============================================================

function arg(flag) {
  const index = args.indexOf(flag);

  if (index < 0) {
    return null;
  }

  const value = args[index + 1];

  if (!value || value.startsWith('--')) {
    throw new Error(
      `${flag} membutuhkan nilai.`
    );
  }

  return value.trim();
}

function jsonWrite(filename, data) {
  fs.writeFileSync(
    filename,
    JSON.stringify(data, null, 2) + '\n',
    'utf8'
  );
}

function requireFile(filename) {
  if (
    !fs.existsSync(filename) ||
    !fs.statSync(filename).isFile()
  ) {
    throw new Error(
      `File wajib tidak ditemukan: ${filename}`
    );
  }
}

function color(value, label) {
  if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(
      `${label} harus menggunakan format #RRGGBB.`
    );
  }

  return value.toUpperCase();
}

function png(filename) {
  requireFile(filename);

  const signature = fs
    .readFileSync(filename)
    .subarray(0, 8);

  const expected = Buffer.from(
    '89504e470d0a1a0a',
    'hex'
  );

  if (!signature.equals(expected)) {
    throw new Error(
      `Bukan PNG yang valid: ${filename}`
    );
  }
}

// ============================================================
// 2. INPUT PROJECT
// ============================================================

const appName = arg('--name');

if (!appName) {
  console.error(
    'Contoh: npm run create:app -- --name "DeyNotes"'
  );

  process.exit(1);
}

const keyInput = arg('--key') ?? appName;

const releaseOwner = arg('--owner') ?? '';

const primaryColor = color(
  arg('--primary') ?? '#6750A4',
  'primaryColor'
);

const backgroundColor = color(
  arg('--background') ?? '#FFFFFF',
  'backgroundColor'
);

const iconInput = arg('--icon');

const iconSource = iconInput
  ? path.resolve(iconInput)
  : null;

if (iconSource) {
  png(iconSource);
}

// Optional portrait art is independent of the Android launcher icon.
const splashInput = arg('--splash');
const splashSource = splashInput ? path.resolve(splashInput) : null;
if (splashSource) png(splashSource);

// ============================================================
// 3. APPLICATION IDENTITY
// ============================================================

const appKey = keyInput
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

if (!/^[a-z][a-z0-9_]*$/.test(appKey)) {
  throw new Error(
    'App key harus diawali huruf kecil ' +
    'dan hanya berisi a-z, 0-9, atau _.'
  );
}

const releaseRepository =
  arg('--repo') ?? appKey;

if (
  releaseOwner &&
  !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(
    releaseOwner
  )
) {
  throw new Error(
    'GitHub owner tidak valid.'
  );
}

if (
  !/^[a-zA-Z0-9._-]+$/.test(releaseRepository) ||
  ['.', '..'].includes(releaseRepository)
) {
  throw new Error(
    'GitHub repository tidak valid.'
  );
}

const slug = appKey.replace(/_/g, '-');

const scheme = appKey.replace(/_/g, '');

const androidPackage =
  `app.debiyan.${appKey}`;

const iosBundleIdentifier =
  `app.debiyan.${appKey.replace(/_/g, '-')}`;

const databaseName = `${appKey}.db`;

const destination = path.resolve(
  ROOT,
  '..',
  appKey
);

const workflowTemplate = path.join(
  ROOT,
  'scripts',
  'templates',
  'release-android.yml'
);

// ============================================================
// 4. VALIDATE STARTER KIT
// ============================================================

if (fs.existsSync(destination)) {
  throw new Error(
    `Folder project sudah ada: ${destination}`
  );
}

const requiredFiles = [
  'app.json',
  'app.config.ts',
  'src/components/FullscreenStartupSplash.tsx',
  'package.json',
  'package-lock.json',
  'eas.json',
  'src/app/_layout.tsx',
  'src/database/initialize.ts',
  'src/database/migrations.ts',
  'src/database/migrations-v2.ts',
  'src/database/validate-schema.ts',
  'src/database/verified-initialize.ts',
  'scripts/validate-project.mjs',
  'src/types/css.d.ts',
];

for (const filename of requiredFiles) {
  requireFile(
    path.join(ROOT, filename)
  );
}

requireFile(workflowTemplate);

// Validator menggunakan dependency yaml.
const rootPackage = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, 'package.json'),
    'utf8'
  )
);

if (
  !rootPackage.dependencies?.yaml &&
  !rootPackage.devDependencies?.yaml
) {
  throw new Error(
    'Package yaml belum terpasang. ' +
    'Jalankan: npm install -D yaml'
  );
}

// Pastikan starter kit sudah menggunakan
// initializeVerifiedDatabase.
const layout = fs.readFileSync(
  path.join(ROOT, 'src/app/_layout.tsx'),
  'utf8'
);

if (
  !layout.includes('initializeVerifiedDatabase(db)') ||
  !/onInit\s*=\s*\{initialize\}/.test(layout) ||
  !layout.includes('<FullscreenStartupSplash')
) {
  throw new Error(
    'Root layout harus menunggu SQLite initialization dan menggunakan fullscreen splash.'
  );
}

// ============================================================
// 5. COPY FILTER
// ============================================================

const ignoredDirectories = new Set([
  '.git',
  '.github',
  '.expo',
  '.eas',
  'node_modules',
  'android',
  'ios',
  'dist',
  'build',
  'coverage',
  '.next',
  '.turbo',
]);

const ignoredFiles = new Set([
  '.npmrc',
  '.netrc',
  'credentials.json',
  'google-services.json',
  'GoogleService-Info.plist',
  'eas-build.json',
  'app.config.js',
]);

const ignoredExtensions = new Set([
  '.apk',
  '.aab',
  '.db',
  '.db-wal',
  '.db-shm',
  '.db-journal',
  '.sqlite',
  '.sqlite3',
  '.sqlite-wal',
  '.sqlite-shm',
  '.jks',
  '.keystore',
  '.p12',
  '.pfx',
  '.pem',
  '.p8',
  '.key',
  '.mobileprovision',
]);

console.log(
  `[DeyKit] Membuat aplikasi ${appName}...`
);

// ============================================================
// 6. GENERATE APPLICATION
// ============================================================

try {
  // ----------------------------------------------------------
  // 6.1 COPY STARTER KIT
  // ----------------------------------------------------------

  fs.cpSync(ROOT, destination, {
    recursive: true,

    filter(source) {
      const relative = path.relative(
        ROOT,
        source
      );

      if (!relative) {
        return true;
      }

      const portablePath = relative
        .split(path.sep)
        .join('/');

      // Project turunan tidak membawa generator.
      if (
        portablePath ===
          'scripts/create-app.mjs' ||
        portablePath ===
          'scripts/templates' ||
        portablePath.startsWith(
          'scripts/templates/'
        ) ||
        portablePath ===
          'docs/DEYKIT.md'
      ) {
        return false;
      }

      if (
        fs.lstatSync(source).isSymbolicLink()
      ) {
        return false;
      }

      const segments = relative.split(
        path.sep
      );

      if (
        segments.some((segment) =>
          ignoredDirectories.has(segment)
        )
      ) {
        return false;
      }

      const basename = path.basename(source);

      if (ignoredFiles.has(basename)) {
        return false;
      }

      if (
        /^\.env(?:\..*)?$/i.test(basename)
      ) {
        return false;
      }

      const extension = path
        .extname(basename)
        .toLowerCase();

      if (
        ignoredExtensions.has(extension)
      ) {
        return false;
      }

      return true;
    },
  });

  // ==========================================================
  // 7. PROJECT CONFIGURATION
  // ==========================================================

  const project = {
    brand: {
      name: 'Debiyan',
    },

    branding: {
      primaryColor,
      backgroundColor,

      icon:
        './assets/images/icon.png',

      splashImage:
        './assets/images/splash-icon.png',
    },

    app: {
      name: appName,
      key: appKey,
      slug,
      scheme,
      androidPackage,
      iosBundleIdentifier,
      databaseName,
    },

    release: {
      owner: releaseOwner,
      repository: releaseRepository,
      apkPrefix: appKey,
    },
  };

  jsonWrite(
    path.join(
      destination,
      'project.config.json'
    ),
    project
  );

  // ==========================================================
  // 8. ICON AND SPLASH ASSETS
  // ==========================================================

  const imagesDir = path.join(
    destination,
    'assets',
    'images'
  );

  fs.mkdirSync(imagesDir, {
    recursive: true,
  });

  if (iconSource) {
    for (const filename of [
      'icon.png',
      'android-icon-foreground.png',
    ]) {
      fs.copyFileSync(
        iconSource,
        path.join(imagesDir, filename)
      );
    }
  }

  if (splashSource) {
    fs.copyFileSync(splashSource, path.join(imagesDir, 'splash-icon.png'));
  }

  for (const filename of [
    'icon.png',
    'android-icon-foreground.png',
    'splash-icon.png',
  ]) {
    png(
      path.join(imagesDir, filename)
    );
  }

  // ==========================================================
  // 9. RESET EXPO CONFIGURATION
  // ==========================================================

  const appJsonFile = path.join(
    destination,
    'app.json'
  );

  const appJson = JSON.parse(
    fs.readFileSync(appJsonFile, 'utf8')
  );

  if (!appJson.expo) {
    throw new Error(
      'app.json tidak memiliki object expo.'
    );
  }

  const expo = appJson.expo;

  // Identitas aplikasi baru.
  expo.name = appName;
  expo.slug = slug;
  expo.scheme = scheme;
  expo.version = '1.0.0';

  // Dynamic icon.
  expo.icon = project.branding.icon;

  // Identitas EAS lama.
  delete expo.owner;
  delete expo.runtimeVersion;

  // Android.
  expo.android ??= {};

  expo.android.package = androidPackage;
  expo.android.versionCode = 1;

  // Do not retain the starter's backgroundImage/monochromeImage:
  // they can override the freshly generated brand colors/icons.
  expo.android.adaptiveIcon = {
    foregroundImage: './assets/images/android-icon-foreground.png',
    backgroundColor,
  };

  delete expo.android.googleServicesFile;

  // iOS.
  expo.ios ??= {};

  expo.ios.bundleIdentifier =
    iosBundleIdentifier;

  expo.ios.buildNumber = '1';
  expo.ios.icon = project.branding.icon;

  delete expo.ios.googleServicesFile;

  // Web.
  expo.web ??= {};

  expo.web.favicon =
    project.branding.icon;

  // Reset EAS Project ID.
  expo.extra ??= {};

  delete expo.extra.eas;

  // Reset EAS Update URL/identity. The URL will be assigned by
  // `eas update:configure` after a project-specific EAS init.
  expo.updates ??= {};
  delete expo.updates.url;
  expo.updates.checkAutomatically = 'NEVER';
  expo.runtimeVersion = { policy: 'appVersion' };

  // ----------------------------------------------------------
  // SPLASH PLUGIN
  // ----------------------------------------------------------

  expo.plugins ??= [];

  const splashConfig = {
    backgroundColor,
    image: './assets/images/android-icon-foreground.png',
    imageWidth: 120,
    resizeMode: 'contain',
    dark: {
      backgroundColor,
      image: './assets/images/android-icon-foreground.png',
    },
  };

  const splashIndex =
    expo.plugins.findIndex((plugin) =>
      plugin === 'expo-splash-screen' ||
      (
        Array.isArray(plugin) &&
        plugin[0] === 'expo-splash-screen'
      )
    );

  const previousSplash =
    splashIndex >= 0 &&
    Array.isArray(
      expo.plugins[splashIndex]
    )
      ? expo.plugins[splashIndex][1] ?? {}
      : {};

  const splashPlugin = [
    'expo-splash-screen',
    {
      ...previousSplash,
      ...splashConfig,
    },
  ];

  if (splashIndex >= 0) {
    expo.plugins[splashIndex] =
      splashPlugin;
  } else {
    expo.plugins.push(splashPlugin);
  }

  jsonWrite(appJsonFile, appJson);

  // ==========================================================
  // 10. APP CONFIG SINGLE SOURCE OF TRUTH
  // ==========================================================
  // `app.config.ts` is inherited from the DeyKit starter (step 6).
  // That same file handles identity, native splash and EAS settings.
  // Do not generate a second, divergent app.config.ts template here.
  requireFile(path.join(destination, 'app.config.ts'));

  // ==========================================================
  // 11. GENERATE DYNAMIC UPDATE SERVICE
  // ==========================================================

  const updateService = String.raw`
import * as Application from 'expo-application';
import Constants from 'expo-constants';

type GithubAsset = {
  name: string;
  browser_download_url: string;
};

type GithubRelease = {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  assets: GithubAsset[];
};

export type AppUpdateInfo = {
  currentVersion: string;
  latestVersion: string | null;
  hasUpdate: boolean;
  downloadUrl: string | null;
  prerelease: boolean;
};

const settings =
  Constants.expoConfig?.extra?.project;

const owner = String(
  settings?.releaseOwner ?? ''
).trim();

const repo = String(
  settings?.releaseRepository ?? ''
).trim();

function normalize(version: string): string {
  return version.trim().replace(/^v/i, '');
}

function numbers(
  version: string
): number[] | null {
  const value = normalize(version);

  return /^\d+\.\d+\.\d+$/.test(value)
    ? value.split('.').map(Number)
    : null;
}

function compare(
  a: string,
  b: string
): number {
  const left = numbers(a);
  const right = numbers(b);

  if (!left || !right) {
    return 0;
  }

  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) {
      return left[i] - right[i];
    }
  }

  return 0;
}

export function getInstalledVersion(): string {
  return (
    Application.nativeApplicationVersion ??
    Constants.expoConfig?.version ??
    '0.0.0'
  );
}

export async function checkForAppUpdate():
  Promise<AppUpdateInfo> {
  const currentVersion =
    getInstalledVersion();

  if (!owner || !repo) {
    throw new Error(
      'GitHub Releases belum dikonfigurasi.'
    );
  }

  const url =
    'https://api.github.com/repos/' +
    encodeURIComponent(owner) + '/' +
    encodeURIComponent(repo) +
    '/releases?per_page=30';

  const response = await fetch(url, {
    headers: {
      Accept:
        'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(
      'GitHub Releases HTTP ' +
      response.status
    );
  }

  const data: unknown =
    await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      'Respons GitHub tidak valid.'
    );
  }

  const valid =
    (data as GithubRelease[])
      .filter((entry) =>
        !entry.draft &&
        numbers(entry.tag_name) !== null &&
        Array.isArray(entry.assets) &&
        entry.assets.some((asset) =>
          asset.name
            .toLowerCase()
            .endsWith('.apk')
        )
      )
      .sort((a, b) =>
        compare(
          b.tag_name,
          a.tag_name
        )
      );

  const latest = valid[0];

  if (!latest) {
    return {
      currentVersion,
      latestVersion: null,
      hasUpdate: false,
      downloadUrl: null,
      prerelease: false,
    };
  }

  const apk = latest.assets.find(
    (asset) =>
      asset.name
        .toLowerCase()
        .endsWith('.apk')
  );

  return {
    currentVersion,

    latestVersion:
      normalize(latest.tag_name),

    hasUpdate:
      compare(
        latest.tag_name,
        currentVersion
      ) > 0,

    downloadUrl:
      apk?.browser_download_url ?? null,

    prerelease:
      latest.prerelease,
  };
}
`.trimStart();

  const updatePath = path.join(
    destination,
    'src',
    'services',
    'app-update.ts'
  );

  fs.mkdirSync(
    path.dirname(updatePath),
    { recursive: true }
  );

  fs.writeFileSync(
    updatePath,
    updateService,
    'utf8'
  );

  // ==========================================================
  // 12. GENERATE AUTO UPDATE CHECKER
  // ==========================================================

  const autoUpdateSource = String.raw`
import { useEffect } from 'react';

import {
  Alert,
  Linking,
  Platform,
} from 'react-native';

import Constants from 'expo-constants';

import {
  checkForAppUpdate,
} from '@/services/app-update';

export default function AutoUpdateChecker() {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    let cancelled = false;

    const appName = String(
      Constants.expoConfig?.extra?.project?.appName ??
      Constants.expoConfig?.name ??
      'Aplikasi'
    );

    async function check() {
      try {
        const update =
          await checkForAppUpdate();

        if (
          cancelled ||
          !update.hasUpdate ||
          !update.downloadUrl
        ) {
          return;
        }

        const url =
          update.downloadUrl;

        Alert.alert(
          'Pembaruan Tersedia',

          appName + ' v' +
          update.latestVersion +
          ' tersedia.\n' +
          'Versi terpasang: v' +
          update.currentVersion,

          [
            {
              text: 'Nanti',
              style: 'cancel',
            },
            {
              text: 'Update Sekarang',

              onPress: () => {
                Linking.openURL(url).catch(
                  () => {
                    Alert.alert(
                      'Gagal',
                      'Tidak dapat membuka APK.'
                    );
                  }
                );
              },
            },
          ],

          {
            cancelable: true,
          }
        );
      } catch {
        // Aplikasi tetap berjalan saat offline.
      }
    }

    void check();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
`.trimStart();

  const checkerPath = path.join(
    destination,
    'src',
    'components',
    'auto-update-checker.tsx'
  );

  fs.mkdirSync(
    path.dirname(checkerPath),
    { recursive: true }
  );

  fs.writeFileSync(
    checkerPath,
    autoUpdateSource,
    'utf8'
  );

  // ==========================================================
  // 13. UPDATE package.json
  // ==========================================================

  const packageFile = path.join(
    destination,
    'package.json'
  );

  const packageJson = JSON.parse(
    fs.readFileSync(
      packageFile,
      'utf8'
    )
  );

  packageJson.name = appKey;
  packageJson.version = '1.0.0';

  packageJson.scripts ??= {};

  // Aplikasi hasil generate tidak membuat project baru.
  delete packageJson.scripts['create:app'];

  packageJson.scripts.validate =
    'node scripts/validate-project.mjs && tsc --noEmit';

  packageJson.scripts['validate:release'] =
    'node scripts/validate-project.mjs --release && tsc --noEmit';

  jsonWrite(
    packageFile,
    packageJson
  );

  // ==========================================================
  // 14. UPDATE package-lock.json
  // ==========================================================

  const lockFile = path.join(
    destination,
    'package-lock.json'
  );

  const lock = JSON.parse(
    fs.readFileSync(
      lockFile,
      'utf8'
    )
  );

  lock.name = appKey;
  lock.version = '1.0.0';

  if (lock.packages?.['']) {
    lock.packages[''].name = appKey;
    lock.packages[''].version = '1.0.0';
  }

  jsonWrite(
    lockFile,
    lock
  );

  // ==========================================================
  // 15. GENERATE GITHUB ACTIONS
  // ==========================================================

  const workflowDir = path.join(
    destination,
    '.github',
    'workflows'
  );

  fs.mkdirSync(
    workflowDir,
    { recursive: true }
  );

  fs.copyFileSync(
    workflowTemplate,
    path.join(
      workflowDir,
      'release-android.yml'
    )
  );

  // ==========================================================
  // 16. GENERATE README.md
  // ==========================================================

  const readme =
    `# ${appName}\n\n` +

    `Aplikasi offline berbasis DeyKit by Debiyan.\n\n` +

    `## Identitas\n\n` +

    `- Android Package: \`${androidPackage}\`\n` +
    `- Database: \`${databaseName}\`\n` +
    `- Version: \`1.0.0\`\n\n` +

    `## Menjalankan aplikasi\n\n` +

    `\`\`\`cmd\n` +
    `npm ci\n` +
    `npm run validate\n` +
    `npx expo start --web\n` +
    `\`\`\`\n\n` +

    `## Android APK & OTA\n\n` +

    `\`\`\`cmd\n` +
    `npx eas-cli@latest init\n` +
    `npx eas-cli@latest update:configure\n` +
    `npx eas-cli@latest build --platform android --profile preview\n` +
    `\`\`\`\n\n` +

    `## GitHub Release\n\n` +

    `Atur \`release.owner\` dan ` +
    `\`release.repository\` dalam ` +
    `\`project.config.json\`.\n\n` +

    `Simpan \`EXPO_TOKEN\` di GitHub Actions Secrets.\n\n` +

    `Gunakan GitHub Actions -> Debiyan Android Release -> patch/minor/major.\n` +
    `Jalankan \`npm run validate:release\` setelah EAS init.\n\n` +

    `Jangan mengganti Android Package, ` +
    `nama database SQLite, atau signing key ` +
    `setelah APK didistribusikan.\n`;

  fs.writeFileSync(
    path.join(
      destination,
      'README.md'
    ),
    readme,
    'utf8'
  );

  // ==========================================================
  // 17. RESULT
  // ==========================================================

  console.log('');
  console.log('========================================');
  console.log(' DEBIYAN PROJECT GENERATOR');
  console.log('========================================');

  console.log('');
  console.log('Project created successfully.');
  console.log('');

  console.log('Brand      : Debiyan');
  console.log('App        :', appName);
  console.log('App Key    :', appKey);
  console.log('Slug       :', slug);

  console.log(
    'Package    :',
    androidPackage
  );

  console.log(
    'Database   :',
    databaseName
  );

  console.log(
    'Primary    :',
    primaryColor
  );

  console.log(
    'Background :',
    backgroundColor
  );

  console.log(
    'Repository :',
    releaseOwner
      ? releaseOwner + '/' +
        releaseRepository
      : '(belum dikonfigurasi)'
  );

  console.log('Version    : 1.0.0');
  console.log('Folder     :', destination);

  console.log('');
  console.log('Workflow   : Generated');
  console.log('Validator  : Included');
  console.log('README     : Generated');
  console.log('EAS ID     : Not configured');

  console.log('');
  console.log('NEXT STEPS');
  console.log('');

  console.log(
    'cd /d "' + destination + '"'
  );

  console.log('npm ci');
  console.log('npm run validate');
  console.log('npx expo start --web --clear');
  console.log('npx eas-cli@latest init');
  console.log('npx eas-cli@latest update:configure');

  console.log('');
} catch (error) {
  // Hanya menghapus folder yang baru dibuat.
  fs.rmSync(destination, {
    recursive: true,
    force: true,
  });

  throw error;
}
