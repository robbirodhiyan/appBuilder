import * as Network from 'expo-network';
import * as Updates from 'expo-updates';
import { Platform } from 'react-native';
import { useSyncExternalStore } from 'react';

type Phase = 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'current' | 'offline' | 'unsupported' | 'error';
type State = { phase: Phase; message: string; showStartup: boolean };
let state: State = { phase: 'idle', message: '', showStartup: false };
let busy = false;
let initialized = false;
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const update = (value: Partial<State>) => { state = { ...state, ...value }; listeners.forEach((fn) => fn()); };
export function useOtaState() { return useSyncExternalStore(subscribe, () => state, () => state); }
export function otaSupported() { return Platform.OS !== 'web' && !__DEV__ && Updates.isEnabled; }
export function dismissOta() { update({ showStartup: false }); }
export async function checkOta(startup = false) {
  if (busy || state.phase === 'downloading' || state.phase === 'ready') return;
  if (!otaSupported()) { update({ phase: 'unsupported', message: 'OTA hanya aktif pada APK release yang sudah dikonfigurasi EAS Update.', showStartup: false }); return; }
  busy = true;
  update({ phase: 'checking', message: 'Memeriksa update...', showStartup: false });
  try {
    const network = await Network.getNetworkStateAsync();
    if (network.isConnected === false || network.isInternetReachable === false) { update({ phase: 'offline', message: 'Perangkat sedang offline.', showStartup: false }); return; }
    const result = await Updates.checkForUpdateAsync();
    update(result.isAvailable ? { phase: 'available', message: 'Pembaruan fitur tersedia.', showStartup: startup }
      : { phase: 'current', message: 'Aplikasi sudah terbaru.', showStartup: false });
  } catch (error) {
    update({ phase: 'error', message: error instanceof Error ? error.message : 'Gagal memeriksa update.', showStartup: false });
  } finally { busy = false; }
}
export async function startupOtaCheck() {
  if (initialized) return;
  initialized = true;
  await checkOta(true);
}
export async function downloadOta() {
  if (busy || state.phase !== 'available') return;
  busy = true;
  update({ phase: 'downloading', message: 'Mengunduh pembaruan...' });
  try {
    const result = await Updates.fetchUpdateAsync();
    update(result.isNew
      ? { phase: 'ready', message: 'Pembaruan diunduh. Simpan pekerjaan sebelum memuat ulang.' }
      : { phase: 'current', message: 'Tidak ada pembaruan baru.', showStartup: false });
  } catch (error) { update({ phase: 'error', message: error instanceof Error ? error.message : 'Gagal mengunduh update.', showStartup: false }); }
  finally { busy = false; }
}
export async function reloadOta() {
  if (busy || state.phase !== 'ready') return;
  busy = true;
  try { await Updates.reloadAsync(); }
  catch (error) { update({ phase: 'error', message: error instanceof Error ? error.message : 'Gagal menerapkan update.', showStartup: false }); }
  finally { busy = false; }
}
