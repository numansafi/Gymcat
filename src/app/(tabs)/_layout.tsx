import { router, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { triggerHaptic } from '../../context/GymcatContext';

const TAB_ITEMS = [
  { name: 'index', href: '/', label: 'Today' },
  { name: 'days', href: '/days', label: 'Days' },
  { name: 'card', href: '/card', label: 'Card' },
] as const;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.brand}>GYMCAT</Text>
      </View>

      <View style={styles.content}>
        <Tabs
          screenOptions={{
            headerShown: false,
            animation: 'none',
            sceneStyle: { backgroundColor: '#101935' },
          }}
          tabBar={({ state }) => (
            <View
              accessibilityRole="tablist"
              style={[
                styles.tabBar,
                { marginBottom: Math.max(14, insets.bottom + 8) },
              ]}
            >
              {TAB_ITEMS.map((item, index) => {
                const isActive = state.index === index;
                return (
                  <Pressable
                    key={item.name}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                    style={[styles.tabButton, isActive && styles.tabButtonActive]}
                    onPress={() => {
                      if (!isActive) {
                        triggerHaptic('selection');
                        router.navigate(item.href);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.tabLabel,
                        isActive && styles.tabLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        >
          <Tabs.Screen name="index" options={{ title: 'Today' }} />
          <Tabs.Screen name="days" options={{ title: 'Days' }} />
          <Tabs.Screen name="card" options={{ title: 'Card' }} />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101935',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D8B4FE',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 5,
    borderRadius: 18,
    backgroundColor: '#162244',
    borderWidth: 1,
    borderColor: '#2A3A68',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 13,
  },
  tabButtonActive: {
    backgroundColor: '#D8B4FE',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A5B4D4',
    letterSpacing: 0.4,
  },
  tabLabelActive: {
    color: '#101935',
  },
});
