
import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

export const DATABASE_NAME = 'appbuilder.db';
export const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(
  db: SQLiteDatabase
): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  if (Platform.OS !== 'web') {
    await db.execAsync('PRAGMA journal_mode = WAL;');
  }

  const result = await db.getFirstAsync<{
    user_version: number;
  }>('PRAGMA user_version;');

  if (!result) {
    throw new Error('Gagal membaca versi database.');
  }

  const currentVersion = result.user_version;

  if (currentVersion > DATABASE_VERSION) {
    throw new Error(
      `Database v${currentVersion} lebih baru dari aplikasi.`
    );
  }

  if (currentVersion === DATABASE_VERSION) {
    return;
  }

  // Kompatibel dengan Android dan Expo Web.
  // Dipanggil saat inisialisasi, sebelum query aplikasi berjalan.
  await db.withTransactionAsync(async () => {
    if (currentVersion < 1) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          sku TEXT NOT NULL COLLATE NOCASE UNIQUE,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_items_name
        ON items(name);
      `);
    }

    await db.execAsync(
      `PRAGMA user_version = ${DATABASE_VERSION};`
    );
  });

  console.log(
    `[SQLite] Migration v${currentVersion} -> v${DATABASE_VERSION} OK`
  );
}
