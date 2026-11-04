import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { NavRail } from '@/components/NavRail';
import { ToastProvider } from '@/components/Toast';
import { MenuProvider } from '@/model/MenuContext';
import { color } from '@/theme';

const BRAND = 'FT';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <MenuProvider>
        <SafeAreaView style={styles.root}>
          <NavRail brand={BRAND} />
          <View style={styles.content}>
            <ToastProvider>
              <Slot />
            </ToastProvider>
          </View>
        </SafeAreaView>
      </MenuProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: color.surface100 },
  content: { flex: 1 },
});
