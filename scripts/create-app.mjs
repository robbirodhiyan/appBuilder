
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ============================================================
// DEBIYAN PROJECT GENERATOR
// ============================================================

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const args = process.argv.slice(2);

// ============================================================
// 1. HELPERS
// ============================================================

function getArgument(name) {
  const index = args.indexOf(name);

  if (index === -1) {
    return null;
  }

  const value = args[index + 1];

  if (!value || value.startsWith('--')) {
    throw new Error(
      `Argument ${name} membutuhkan nilai.`
    );
  }

  return value.trim();
}

function writeJson(filename, data) {
  fs.writeFileSync(
    filename,
    JSON.stringify(data, null, 2) + '\n',
    'utf8'
  );
}

// ============================================================
// 2. INPUT PROJECT
// ============================================================

const appName = getArgument('--name');
const keyInput = getArgument('--key') ?? appName;

const releaseOwner = getArgument('--owner') ?? '';
const releaseRepositoryInput = getArgument('--repo');

if (!appName || !keyInput) {
  console.error(
    'Usage: npm run create:app -- --name "DeyLab"'
  );

  process.exit(1);
}

// ============================================================
// 3. NORMALIZE APPLICATION IDENTITY
// ============================================================

const appKey = keyInput
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

if (!/^[a-z][a-z0-9_]*$/.test(appKey)) {
  throw new Error(
    'App key harus diawali huruf dan hanya ' +
    'berisi a-z, 0-9, atau underscore.'
  );
}

const releaseRepository =
  releaseRepositoryInput ?? appKey;

if (
  !/^[A-Za-z0-9._-]+$/.test(releaseRepository) ||
  releaseRepository === '.' ||
  releaseRepository === '..'
) {
  throw new Error(
    'Nama repository GitHub tidak valid.'
  );
}

if (
  releaseOwner &&
  !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(
    releaseOwner
  )
) {
  throw new Error(
    'GitHub owner tidak valid.'
  );
}

const slug = appKey.replace(/_/g, '-');
const scheme = appKey.replace(/_/g, '');

const applicationId = `app.debiyan.${appKey}`;

const iosBundleId =
  `app.debiyan.${appKey.replace(/_/g, '-')}`;

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
// 4. VALIDATE SOURCE PROJECT
// ============================================================

if (fs.existsSync(destination)) {
  throw new Error(
    `Folder tujuan sudah tersedia: ${destination}\n` +
    'Generator tidak akan menimpa project lama.'
  );
}

const requiredFiles = [
  path.join(ROOT, 'app.json'),
  path.join(ROOT, 'package.json'),
  workflowTemplate,
];

for (const filename of requiredFiles) {
  if (!fs.existsSync(filename)) {
    throw new Error(
      `File starter kit tidak ditemukan: ${filename}`
    );
  }
}

// ============================================================
// 5. COPY STARTER KIT
// ============================================================

const excludedDirectories = new Set([
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
]);

const excludedExtensions = new Set([
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

const excludedFiles = new Set([
  '.npmrc',
  '.netrc',
  'credentials.json',
  'google-services.json',
  'GoogleService-Info.plist',
  'eas-build.json',
  'app.config.js',
]);

console.log('');
console.log(`[Generator] Creating ${appName}...`);

fs.cpSync(ROOT, destination, {
  recursive: true,

  filter(source) {
    const relative = path.relative(ROOT, source);

    if (!relative) {
      return true;
    }

    const segments = relative.split(path.sep);

    if (
      segments.some((segment) =>
        excludedDirectories.has(segment)
      )
    ) {
      return false;
    }

    // Jangan mengikuti symbolic link.
    if (fs.lstatSync(source).isSymbolicLink()) {
      return false;
    }

    const basename = path.basename(source);

    if (excludedFiles.has(basename)) {
      return false;
    }

    // Jangan menyalin .env, .env.local, dan lainnya.
    if (/^\.env(?:\..*)?$/i.test(basename)) {
      return false;
    }

    const extension = path
      .extname(basename)
      .toLowerCase();

    if (excludedExtensions.has(extension)) {
      return false;
    }

    return true;
  },
});

// ============================================================
// 6. GENERATE project.config.json
// ============================================================

const project = {
  brand: {
    name: 'Debiyan',
  },

  app: {
    name: appName,
    key: appKey,
    slug,
    scheme,

    androidPackage: applicationId,

    iosBundleIdentifier: iosBundleId,

    databaseName: `${appKey}.db`,
  },

  release: {
    owner: releaseOwner,
    repository: releaseRepository,
    apkPrefix: appKey,
  },
};

writeJson(
  path.join(destination, 'project.config.json'),
  project
);

// ============================================================
// 7. RESET app.json
// ============================================================

const appJsonPath = path.join(
  destination,
  'app.json'
);

const appJson = JSON.parse(
  fs.readFileSync(appJsonPath, 'utf8')
);

if (!appJson.expo) {
  throw new Error(
    'app.json tidak memiliki object expo.'
  );
}

const expo = appJson.expo;

// Application identity.
expo.name = appName;
expo.slug = slug;
expo.scheme = scheme;

// Aplikasi baru dimulai dari v1.0.0.
expo.version = '1.0.0';

// Android.
expo.android ??= {};

expo.android.package = applicationId;
expo.android.versionCode = 1;

// iOS.
expo.ios ??= {};

expo.ios.bundleIdentifier = iosBundleId;
expo.ios.buildNumber = '1';

// Jangan membawa owner/project lama.
delete expo.owner;

// Hapus identitas EAS dari starter kit.
if (expo.extra?.eas) {
  delete expo.extra.eas;
}

// Hapus URL update EAS lama.
if (expo.updates?.url) {
  delete expo.updates.url;
}

// Runtime version lama tidak diwariskan.
delete expo.runtimeVersion;

writeJson(appJsonPath, appJson);

// ============================================================
// 8. GENERATE app.config.ts
// ============================================================

const expoConfig = String.raw`
import type {
  ConfigContext,
  ExpoConfig,
} from 'expo/config';

import project from './project.config.json';

export default ({
  config,
}: ConfigContext): ExpoConfig => {
  const { brand, app, release } = project;

  if (!/^[a-z][a-z0-9_]*$/.test(app.key)) {
    throw new Error('Invalid Debiyan app key.');
  }

  if (!/^[a-z][a-z0-9-]*$/.test(app.slug)) {
    throw new Error('Invalid Expo slug.');
  }

  if (
    app.androidPackage !==
    'app.debiyan.' + app.key
  ) {
    throw new Error(
      'Android package tidak sesuai standar Debiyan.'
    );
  }

  return {
    ...config,

    name: app.name,
    slug: app.slug,
    scheme: app.scheme,

    android: {
      ...config.android,
      package: app.androidPackage,
    },

    ios: {
      ...config.ios,
      bundleIdentifier: app.iosBundleIdentifier,
    },

    extra: {
      ...config.extra,

      project: {
        brandName: brand.name,
        appName: app.name,
        appKey: app.key,

        databaseName: app.databaseName,

        apkPrefix: release.apkPrefix,
        releaseOwner: release.owner,
        releaseRepository: release.repository,
      },
    },
  };
};
`.trimStart();

fs.writeFileSync(
  path.join(destination, 'app.config.ts'),
  expoConfig,
  'utf8'
);

// ============================================================
// 9. GENERATE DYNAMIC UPDATE CHECKER
// ============================================================

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

const settings = Constants.expoConfig?.extra?.project;

const RELEASE_OWNER = String(
  settings?.releaseOwner ?? ''
).trim();

const RELEASE_REPO = String(
  settings?.releaseRepository ?? ''
).trim();

function normalize(value: string): string {
  return value.trim().replace(/^v/i, '');
}

function parseVersion(value: string): number[] | null {
  const normalized = normalize(value);

  if (!/^\d+\.\d+\.\d+$/.test(normalized)) {
    return null;
  }

  return normalized.split('.').map(Number);
}

function compareVersions(a: string, b: string): number {
  const left = parseVersion(a);
  const right = parseVersion(b);

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
  const currentVersion = getInstalledVersion();

  if (!RELEASE_OWNER || !RELEASE_REPO) {
    throw new Error(
      'GitHub Releases belum dikonfigurasi.'
    );
  }

  const api =
    'https://api.github.com/repos/' +
    encodeURIComponent(RELEASE_OWNER) + '/' +
    encodeURIComponent(RELEASE_REPO) +
    '/releases?per_page=30';

  const response = await fetch(api, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(
      'GitHub Releases HTTP ' + response.status
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Respons GitHub tidak valid.');
  }

  const releases = data as GithubRelease[];

  const candidates = releases
    .filter((release) =>
      !release.draft &&
      parseVersion(release.tag_name) !== null &&
      Array.isArray(release.assets) &&
      release.assets.some((asset) =>
        asset.name.toLowerCase().endsWith('.apk')
      )
    )
    .sort((a, b) =>
      compareVersions(b.tag_name, a.tag_name)
    );

  const latest = candidates[0];

  if (!latest) {
    return {
      currentVersion,
      latestVersion: null,
      hasUpdate: false,
      downloadUrl: null,
      prerelease: false,
    };
  }

  const apk = latest.assets.find((asset) =>
    asset.name.toLowerCase().endsWith('.apk')
  );

  return {
    currentVersion,
    latestVersion: normalize(latest.tag_name),
    hasUpdate:
      compareVersions(
        latest.tag_name,
        currentVersion
      ) > 0,
    downloadUrl: apk?.browser_download_url ?? null,
    prerelease: latest.prerelease,
  };
}
`.trimStart();

const updateServicePath = path.join(
  destination,
  'src',
  'services',
  'app-update.ts'
);

fs.mkdirSync(
  path.dirname(updateServicePath),
  { recursive: true }
);

fs.writeFileSync(
  updateServicePath,
  updateService,
  'utf8'
);

// ============================================================
// 10. UPDATE package.json
// ============================================================

const packagePath = path.join(
  destination,
  'package.json'
);

const packageJson = JSON.parse(
  fs.readFileSync(packagePath, 'utf8')
);

packageJson.name = appKey;
packageJson.version = '1.0.0';

writeJson(packagePath, packageJson);

// ============================================================
// 11. UPDATE package-lock.json
// ============================================================

const lockPath = path.join(
  destination,
  'package-lock.json'
);

if (fs.existsSync(lockPath)) {
  const lock = JSON.parse(
    fs.readFileSync(lockPath, 'utf8')
  );

  lock.name = appKey;
  lock.version = '1.0.0';

  if (lock.packages?.['']) {
    lock.packages[''].name = appKey;
    lock.packages[''].version = '1.0.0';
  }

  writeJson(lockPath, lock);
}

// ============================================================
// 12. GENERATE UNIVERSAL GITHUB ACTIONS
// ============================================================

const workflowDirectory = path.join(
  destination,
  '.github',
  'workflows'
);

const workflowDestination = path.join(
  workflowDirectory,
  'release-android.yml'
);

fs.mkdirSync(
  workflowDirectory,
  { recursive: true }
);

fs.copyFileSync(
  workflowTemplate,
  workflowDestination
);

// ============================================================
// 13. RESULT
// ============================================================

console.log('');
console.log('========================================');
console.log(' DEBIYAN PROJECT GENERATOR');
console.log('========================================');

console.log('');
console.log('Project created successfully.');
console.log('');

console.log('Brand    : Debiyan');
console.log('App      :', appName);
console.log('App Key  :', appKey);
console.log('Slug     :', slug);

console.log('Package  :', applicationId);
console.log('Database :', project.app.databaseName);

console.log('Version  : 1.0.0');

console.log(
  'Release  :',
  releaseOwner
    ? `${releaseOwner}/${releaseRepository}`
    : 'GitHub owner belum dikonfigurasi'
);

console.log('APK      :', `${appKey}-v1.0.0.apk`);
console.log('Folder   :', destination);

console.log('');
console.log('GitHub Actions: Generated');
console.log('EAS Project ID: Not configured');

console.log('');
console.log('========================================');
console.log(' NEXT STEPS');
console.log('========================================');
console.log('');

console.log(`cd /d "${destination}"`);

console.log('npm ci');

console.log('npx expo config --type public');

console.log('npx tsc --noEmit');

console.log('npx eas-cli@latest init');

console.log(
  'npx eas-cli@latest build --platform android --profile preview'
);

console.log('');
