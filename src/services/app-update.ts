
import * as Application from 'expo-application';
import Constants from 'expo-constants';

// GitHub repository untuk distribusi APK.
// Gunakan repository public, tanpa access token di aplikasi.
const releaseConfig = Constants.expoConfig?.extra?.project;
const RELEASE_OWNER = String(releaseConfig?.releaseOwner ?? '').trim();
const RELEASE_REPO = String(releaseConfig?.releaseRepository ?? '').trim();

const RELEASE_API =
  `https://api.github.com/repos/${RELEASE_OWNER}/${RELEASE_REPO}/releases?per_page=30`;

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

// Menghilangkan prefix v, contoh v1.0.1 menjadi 1.0.1
function normalizeVersion(value: string): string {
  return value.trim().replace(/^v/i, '');
}

// Parsing versi MAJOR.MINOR.PATCH
function versionParts(value: string): number[] | null {
  const version = normalizeVersion(value);

  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    return null;
  }

  return version.split('.').map(Number);
}

// Membandingkan dua versi numerik.
function compareVersions(a: string, b: string): number {
  const left = versionParts(a);
  const right = versionParts(b);

  if (!left || !right) {
    return 0;
  }

  for (let index = 0; index < 3; index++) {
    if (left[index] !== right[index]) {
      return left[index] - right[index];
    }
  }

  return 0;
}

// Membaca versi aplikasi yang terinstal.
export function getInstalledVersion(): string {
  return (
    Application.nativeApplicationVersion ??
    Constants.expoConfig?.version ??
    '0.0.0'
  );
}

// Memeriksa pembaruan dari GitHub Releases.
export async function checkForAppUpdate(): Promise<AppUpdateInfo> {
  const currentVersion = getInstalledVersion();
  if (!RELEASE_OWNER || !RELEASE_REPO) {
    throw new Error('GitHub release belum dikonfigurasi untuk aplikasi ini.');
  }

  const response = await fetch(RELEASE_API, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        'Repository tidak ditemukan atau tidak dapat diakses secara publik.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        'Akses GitHub API ditolak atau batas request tercapai.'
      );
    }

    throw new Error(
      `Gagal memeriksa update. HTTP ${response.status}`
    );
  }

  const result: unknown = await response.json();

  if (!Array.isArray(result)) {
    throw new Error('Respons GitHub Releases tidak valid.');
  }

  const releases = result as GithubRelease[];

  // Ambil release yang:
  // - Sudah dipublikasikan
  // - Memiliki versi valid
  // - Memiliki file APK
  const candidates = releases
    .filter((release) => {
      return (
        !release.draft &&
        versionParts(release.tag_name) !== null &&
        release.assets.some((asset) =>
          asset.name.toLowerCase().endsWith('.apk')
        )
      );
    })
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

  const latestVersion = normalizeVersion(latest.tag_name);

  return {
    currentVersion,
    latestVersion,
    hasUpdate:
      compareVersions(latestVersion, currentVersion) > 0,
    downloadUrl: apk?.browser_download_url ?? null,
    prerelease: latest.prerelease,
  };
}
