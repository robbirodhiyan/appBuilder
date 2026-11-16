import StartupOtaDialog from '@/components/startup-ota-dialog';
import FullscreenStartupSplash from '@/components/FullscreenStartupSplash';
import { AppThemeProvider } from '@/contexts/theme-context';
import { DATABASE_NAME } from '@/database/migrations';
import { initializeVerifiedDatabase } from '@/database/verified-initialize';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Must be called outside React components, before root begins rendering.
void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [databaseReady, setDatabaseReady] = useState(false);
  const [databaseError, setDatabaseError] = useState('');

  const initialize = useCallback(async (db: SQLiteDatabase) => {
    await initializeVerifiedDatabase(db);
    setDatabaseReady(true);
  }, []);

  const handleDatabaseError = useCallback((error: Error) => {
    console.error('[DeyKit] SQLite init failed:', error);
    setDatabaseError(error.message || 'Gagal menginisialisasi database.');
  }, []);

  return (
    <FullscreenStartupSplash ready={databaseReady || !!databaseError}>
      <SafeAreaProvider>
        <AppThemeProvider>
          {databaseError ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: '700' }}>Gagal Membuka Aplikasi</Text>
              <Text style={{ marginTop: 12, textAlign: 'center' }}>{databaseError}</Text>
              <Text style={{ marginTop: 12, textAlign: 'center' }}>
                Jangan uninstall aplikasi; data SQLite lokal mungkin masih dapat dipulihkan.
              </Text>
            </View>
          ) : (
            <SQLiteProvider
              databaseName={DATABASE_NAME}
              onInit={initialize}
              onError={handleDatabaseError}
            >
              <StartupOtaDialog />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </SQLiteProvider>
          )}
        </AppThemeProvider>
      </SafeAreaProvider>
    </FullscreenStartupSplash>
  );
}
