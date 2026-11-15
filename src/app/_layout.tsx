
import AutoUpdateChecker from '@/components/auto-update-checker';
import { AppThemeProvider } from '@/contexts/theme-context';

import { DATABASE_NAME } from '@/database/migrations';
import { initializeVerifiedDatabase } from '@/database/verified-initialize';

import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
  onInit={initializeVerifiedDatabase}
        >
          <AutoUpdateChecker />

          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </SQLiteProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
