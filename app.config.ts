
import type {
    ConfigContext,
    ExpoConfig,
} from 'expo/config';

import project from './project.config.json';

export default ({
  config,
}: ConfigContext): ExpoConfig => {
  const { brand, app, release } = project;

  /**
   * 1. VALIDATE APPLICATION KEY
   *
   * Format:
   * deykit
   * maintenance_checklist
   * stock_manager
   */
  if (!/^[a-z][a-z0-9_]*$/.test(app.key)) {
    throw new Error(
      'Invalid App Key. Gunakan huruf kecil, angka, atau underscore.'
    );
  }

  /**
   * 2. VALIDATE EXPO SLUG
   *
   * Mendukung slug lama seperti appBuilder.
   */
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(app.slug)) {
    throw new Error('Invalid Expo slug.');
  }

  /**
   * 3. VALIDATE DATABASE NAME
   */
  if (!/^[a-zA-Z0-9_-]+\.db$/.test(app.databaseName)) {
    throw new Error('Invalid SQLite database name.');
  }

  /**
   * 4. EXPO CONFIGURATION
   */
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
        releaseRepository: release.repository,
      },
    },
  };
};
