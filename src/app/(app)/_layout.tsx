import { Slot } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavRail } from '@/components/NavRail';
import { ToastProvider } from '@/components/Toast';
import { SignOutDialog } from '@/features/auth/SignOutDialog';
import { MenuProvider } from '@/model/MenuContext';
import { color } from '@/theme';

const BRAND = 'FT';

/** Signed-in area: the menu only loads after login. */
export default function AppLayout() {
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);

  return (
    <MenuProvider>
      <SafeAreaView style={styles.root}>
        <NavRail brand={BRAND} onSignOut={() => setConfirmingSignOut(true)} />
        <View style={styles.content}>
          <ToastProvider>
            <Slot />
          </ToastProvider>
        </View>
      </SafeAreaView>
      {confirmingSignOut && <SignOutDialog onCancel={() => setConfirmingSignOut(false)} />}
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: color.surface100 },
  content: { flex: 1 },
});
