import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Card, Dialog, Portal, ProgressBar, Text } from 'react-native-paper';
import { checkOta, downloadOta, otaSupported, reloadOta, useOtaState } from '@/services/ota-center';
export default function OtaUpdateCard() {
  const state = useOtaState();
  const native = Updates.useUpdates();
  const [confirm, setConfirm] = useState(false);
  const progress = typeof native.downloadProgress === 'number' ? native.downloadProgress : null;
  useEffect(() => {
    // A new update may have finished downloading through an independent check.
  }, []);
  return (
    <>
      <Card mode="outlined"><Card.Content style={{ gap: 12 }}>
        <Text variant="titleLarge">Pembaruan Fitur (OTA)</Text>
        <Text variant="bodySmall">{state.message || 'Cek pembaruan tanpa memasang APK baru.'}</Text>
        {state.phase === 'checking' && <ActivityIndicator />}
        {state.phase === 'downloading' && (
          progress === null ? <ActivityIndicator /> : <ProgressBar progress={Math.max(0, Math.min(1, progress))} />
        )}
        {state.phase === 'available' ? (
          <Button mode="contained" onPress={() => void downloadOta()}>Unduh Update</Button>
        ) : state.phase === 'ready' ? (
          <Button mode="contained" onPress={() => setConfirm(true)}>Terapkan Update</Button>
        ) : (
          <Button mode="contained-tonal" disabled={!otaSupported() || state.phase === 'checking' || state.phase === 'downloading'}
            onPress={() => void checkOta(false)}>Cek Pembaruan OTA</Button>
        )}
      </Card.Content></Card>
      <Portal><Dialog visible={confirm} onDismiss={() => setConfirm(false)}>
        <Dialog.Title>Terapkan pembaruan?</Dialog.Title>
        <Dialog.Content><Text>Simpan pekerjaan sebelum aplikasi dimuat ulang.</Text></Dialog.Content>
        <Dialog.Actions><Button onPress={() => setConfirm(false)}>Batal</Button>
          <Button onPress={() => { setConfirm(false); void reloadOta(); }}>Muat Ulang</Button>
        </Dialog.Actions>
      </Dialog></Portal>
    </>
  );
}
