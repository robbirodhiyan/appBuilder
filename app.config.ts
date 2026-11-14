
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
    throw new Error(
      'Invalid app key. Gunakan huruf kecil, angka, dan underscore.'
    );
  }

  if (!/^[a-z][a-z0-9_-]*$/.test(app.slug)) {
    throw new Error('Invalid Expo slug.');
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
        releaseRepository: release.repository,
      },
    },
  };
};
