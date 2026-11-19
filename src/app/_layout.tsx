import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ConfettiBurst } from '../components/ConfettiBurst';
import { GymcatProvider, useGymcat } from '../context/GymcatContext';

function RootShell() {
  const { burstKey } = useGymcat();

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
      <ConfettiBurst burstKey={burstKey} />
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
