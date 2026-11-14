
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppThemeProvider } from '@/contexts/theme-context';

import {
  DATABASE_NAME,
  migrateDbIfNeeded,
} from '@/database/migrations';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          onInit={migrateDbIfNeeded}
        >
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
