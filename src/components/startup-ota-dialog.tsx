import Constants from 'expo-constants';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { checkOta, dismissOta, downloadOta, reloadOta, startupOtaCheck, useOtaState } from '@/services/ota-center';

export default function StartupOtaDialog() {
  const { phase, message, showStartup } = useOtaState();
  const pathname = usePathname();
  const [confirm, setConfirm] = useState(false);
  useEffect(() => { void startupOtaCheck(); }, []);
  const onHome = pathname === '/' || pathname === '/index';
  const visible = onHome && showStartup && ['available','downloading','ready'].includes(phase);
  return (
    <Portal>
      <Dialog visible={visible && !confirm} onDismiss={dismissOta}>
        <Dialog.Icon icon="update" />
        <Dialog.Title>Pembaruan {Constants.expoConfig?.name ?? 'Aplikasi'}</Dialog.Title>
        <Dialog.Content><Text>{message}</Text></Dialog.Content>
        <Dialog.Actions>
          <Button onPress={dismissOta}>Nanti Saja</Button>
          {phase === 'available' && <Button onPress={() => void downloadOta()}>Unduh</Button>}
          {phase === 'ready' && <Button onPress={() => setConfirm(true)}>Terapkan</Button>}
        </Dialog.Actions>
      </Dialog>
      <Dialog visible={visible && confirm} onDismiss={() => setConfirm(false)}>
        <Dialog.Title>Muat ulang aplikasi?</Dialog.Title>
        <Dialog.Content><Text>Pastikan semua pekerjaan sudah tersimpan.</Text></Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => { setConfirm(false); dismissOta(); }}>Nanti</Button>
          <Button onPress={() => { setConfirm(false); dismissOta(); void reloadOta(); }}>Muat Ulang</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
