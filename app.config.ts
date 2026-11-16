import type { ConfigContext, ExpoConfig } from 'expo/config';
import project from './project.config.json';

const NATIVE_SPLASH_IMAGE = './assets/images/android-icon-foreground.png';

export default ({ config }: ConfigContext): ExpoConfig => {
  const { brand, app, branding, release } = project;
  if (!/^[a-z][a-z0-9_]*$/.test(app.key)) throw new Error('Invalid App Key');
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(app.slug)) throw new Error('Invalid Expo slug');
  if (!/^[a-zA-Z0-9_-]+\.db$/.test(app.databaseName)) throw new Error('Invalid SQLite database name');
  const legacyStarter = app.key === 'deykit' && app.androidPackage === 'app.debiyan.builder';
  if (!legacyStarter && app.androidPackage !== `app.debiyan.${app.key}`) {
    throw new Error('Android package tidak sesuai application key');
  }
  const hex = /^#[0-9A-Fa-f]{6}$/;
  if (!hex.test(branding.primaryColor) || !hex.test(branding.backgroundColor)) {
    throw new Error('Warna branding harus #RRGGBB');
  }

  const plugins: NonNullable<ExpoConfig['plugins']> = [...(config.plugins ?? [])];
  const splashIndex = plugins.findIndex(
    (item) => item === 'expo-splash-screen' ||
      (Array.isArray(item) && item[0] === 'expo-splash-screen')
  );
  const existingSplash = splashIndex >= 0 ? plugins[splashIndex] : undefined;
  const previous = Array.isArray(existingSplash) ? existingSplash[1] ?? {} : {};
  const splash: NonNullable<ExpoConfig['plugins']>[number] = [
    'expo-splash-screen',
    {
      ...previous,
      image: NATIVE_SPLASH_IMAGE,
      imageWidth: 120,
      resizeMode: 'contain',
      backgroundColor: branding.backgroundColor,
      dark: {
        backgroundColor: branding.backgroundColor,
        image: NATIVE_SPLASH_IMAGE,
      },
    },
  ];
  if (splashIndex < 0) plugins.push(splash);
  else plugins[splashIndex] = splash;

  return {
    ...config,
    name: app.name,
    slug: app.slug,
    scheme: app.scheme,
    icon: branding.icon,
    plugins,
    // Runtime is scoped to a native app version. Each APK release can have a
    // distinct runtime; OTA updates must target the matching runtime/channel.
    runtimeVersion: config.runtimeVersion ?? { policy: 'appVersion' },
    updates: {
      ...config.updates,
      checkAutomatically: 'NEVER',
    },
    android: {
      ...config.android,
      package: app.androidPackage,
      adaptiveIcon: {
        foregroundImage: NATIVE_SPLASH_IMAGE,
        backgroundColor: branding.backgroundColor,
      },
    },
    ios: {
      ...config.ios,
      bundleIdentifier: app.iosBundleIdentifier,
      icon: branding.icon,
    },
    web: { ...config.web, favicon: branding.icon },
    extra: {
      ...config.extra,
      project: {
        brandName: brand.name,
        appName: app.name,
        appKey: app.key,
        databaseName: app.databaseName,
        primaryColor: branding.primaryColor.toUpperCase(),
        backgroundColor: branding.backgroundColor.toUpperCase(),
        apkPrefix: release.apkPrefix,
        releaseOwner: release.owner,
        releaseRepository: release.repository,
      },
    },
  };
};
