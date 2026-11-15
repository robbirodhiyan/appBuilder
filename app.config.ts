
import type {
    ConfigContext,
    ExpoConfig,
} from 'expo/config';

import project from './project.config.json';

export default ({
  config,
}: ConfigContext): ExpoConfig => {
  const { brand, app, release, branding } = project;

  // ============================================================
  // 1. VALIDATE APPLICATION KEY
  // ============================================================

  if (!/^[a-z][a-z0-9_]*$/.test(app.key)) {
    throw new Error(
      'Invalid App Key. Gunakan huruf kecil, angka, atau underscore.'
    );
  }

  // ============================================================
  // 2. VALIDATE EXPO SLUG
  // ============================================================

  // Mendukung slug lama seperti appBuilder.
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(app.slug)) {
    throw new Error(
      'Invalid Expo slug.'
    );
  }

  // ============================================================
  // 3. VALIDATE DATABASE NAME
  // ============================================================

  if (!/^[a-zA-Z0-9_-]+\.db$/.test(app.databaseName)) {
    throw new Error(
      'Invalid SQLite database name.'
    );
  }

  // ============================================================
  // 4. VALIDATE ANDROID APPLICATION ID
  // ============================================================

  if (!/^app\.debiyan\.[a-z][a-z0-9_]*$/.test(
    app.androidPackage
  )) {
    throw new Error(
      'Invalid Android Package. Format: app.debiyan.nama_aplikasi'
    );
  }

  // ============================================================
  // 5. VALIDATE BRANDING COLORS
  // ============================================================

  const colorPattern = /^#[0-9A-Fa-f]{6}$/;

  if (!colorPattern.test(branding.primaryColor)) {
    throw new Error(
      'Invalid primaryColor. Gunakan format #RRGGBB.'
    );
  }

  if (!colorPattern.test(branding.backgroundColor)) {
    throw new Error(
      'Invalid backgroundColor. Gunakan format #RRGGBB.'
    );
  }

  const primaryColor = branding.primaryColor.toUpperCase();
  const backgroundColor =
    branding.backgroundColor.toUpperCase();

  // ============================================================
  // 6. EXPO CONFIGURATION
  // ============================================================

  return {
    ...config,

    // Application identity
    name: app.name,
    slug: app.slug,
    scheme: app.scheme,

    // Android configuration
    android: {
      ...config.android,
      package: app.androidPackage,

      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        backgroundColor,
      },
    },

    // iOS configuration
    ios: {
      ...config.ios,
      bundleIdentifier: app.iosBundleIdentifier,
    },

    // Project-specific branding
    extra: {
      ...config.extra,

      project: {
        brandName: brand.name,
        appName: app.name,
        appKey: app.key,

        databaseName: app.databaseName,

        primaryColor,
        backgroundColor,

        apkPrefix: release.apkPrefix,
        releaseOwner: release.owner,
        releaseRepository: release.repository,
      },
    },
  };
};
