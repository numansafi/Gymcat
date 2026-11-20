import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ConfettiBurst } from '../components/ConfettiBurst';
import { GymcatProvider, useGymcat } from '../context/GymcatContext';

function RootShell() {
  const { isCheckedInToday } = useGymcat();
  const pathname = usePathname();
  const isTodayPage = pathname === '/';

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
      <ConfettiBurst active={isCheckedInToday && isTodayPage} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GymcatProvider>
        <RootShell />
      </GymcatProvider>
    </SafeAreaProvider>
  );
}
