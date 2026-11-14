
import { useEffect } from 'react';
import {
    Alert,
    Linking,
    Platform,
} from 'react-native';

import { checkForAppUpdate } from '@/services/app-update';

export default function AutoUpdateChecker() {
  useEffect(() => {
    // Pemeriksaan otomatis hanya pada Android.
    if (Platform.OS !== 'android') return;

    let cancelled = false;

    async function checkUpdate() {
      try {
        const result = await checkForAppUpdate();

        if (
          cancelled ||
          !result.hasUpdate ||
          !result.latestVersion ||
          !result.downloadUrl
        ) {
          return;
        }

        const downloadUrl = result.downloadUrl;

        Alert.alert(
          'Pembaruan Tersedia',
          `Debiyan Builder v${result.latestVersion} tersedia.\n\n` +
            `Versi terinstal: v${result.currentVersion}\n\n` +
            'Apakah ingin mengunduh pembaruan sekarang?',
          [
            {
              text: 'Nanti',
              style: 'cancel',
            },
            {
              text: 'Update Sekarang',
              onPress: () => {
                Linking.openURL(downloadUrl).catch(
                  () => {
                    Alert.alert(
                      'Gagal Mengunduh',
                      'Tidak dapat membuka tautan APK.'
                    );
                  }
                );
              },
            },
          ],
          { cancelable: true }
        );
      } catch {
        // Offline atau GitHub API gagal:
        // aplikasi tetap berjalan tanpa gangguan.
      }
    }

    void checkUpdate();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
