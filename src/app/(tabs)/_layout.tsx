import { router, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { triggerHaptic } from '../../context/GymcatContext';

const TAB_ITEMS = [
  { name: 'index', href: '/', label: 'Today', icon: '🐾' },
  { name: 'days', href: '/days', label: 'Days', icon: '📅' },
  { name: 'card', href: '/card', label: 'Card', icon: '🏆' },
] as const;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.brand}>Gymcat</Text>
      </View>

      <View style={styles.content}>
        <Tabs
          screenOptions={{
            headerShown: false,
            animation: 'none',
            sceneStyle: { backgroundColor: '#F7F5FA' },
          }}
          tabBar={({ state }) => (
            <View
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
                    <Text style={styles.tabIcon}>{item.icon}</Text>
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
    backgroundColor: '#F7F5FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    color: '#231B2E',
    letterSpacing: -0.4,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 6,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE5F7',
    shadowColor: '#2D2638',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: '#231B2E',
  },
  tabIcon: {
    fontSize: 15,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6A6177',
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
});
