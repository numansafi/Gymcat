import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  AppState,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ConfettiBurst } from './src/components/ConfettiBurst';
import { MonthCardScreen } from './src/screens/MonthCardScreen';
import { MonthlyDaysScreen } from './src/screens/MonthlyDaysScreen';
import { TodayScreen } from './src/screens/TodayScreen';
import {
  buildMonthlySummary,
  formatDateKey,
  loadCheckins,
  saveCheckins,
  toggleCheckinDate,
} from './src/storage/checkins';
import { TabKey } from './src/types/gymcat';

const TABS: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: 'Today', label: 'Today', icon: '🐾' },
  { key: 'Days', label: 'Days', icon: '📅' },
  { key: 'Card', label: 'Card', icon: '🏆' },
];

function triggerHaptic(type: 'success' | 'selection'): void {
  if (Platform.OS === 'web') return;
  const promise =
    type === 'success'
      ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      : Haptics.selectionAsync();
  void promise.catch(() => {});
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('Today');
  const [checkins, setCheckins] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [today, setToday] = useState(() => new Date());

  const todayKey = useMemo(() => formatDateKey(today), [today]);
  const todayLabel = useMemo(
    () =>
      today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    [today],
  );

  useEffect(() => {
    let mounted = true;
    loadCheckins().then((loaded) => {
      if (mounted) {
        setCheckins(loaded);
        setIsLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        const now = new Date();
        setToday((prev) => (formatDateKey(prev) === formatDateKey(now) ? prev : now));
      }
    });
    return () => sub.remove();
  }, []);

  const summary = useMemo(
    () => buildMonthlySummary(checkins, today),
    [checkins, today],
  );

  const isCheckedInToday = checkins.includes(todayKey);

  const updateCheckins = (next: string[]) => {
    setCheckins(next);
    void saveCheckins(next);
  };

  const handleCheckInToday = () => {
    if (!isLoaded || isCheckedInToday) return;
    const next = toggleCheckinDate(checkins, todayKey);
    updateCheckins(next);
    setBurstKey((prev) => prev + 1);
    triggerHaptic('success');
  };

  const handleUndoToday = () => {
    if (!isLoaded || !isCheckedInToday) return;
    const next = toggleCheckinDate(checkins, todayKey);
    updateCheckins(next);
    triggerHaptic('selection');
  };

  const handleToggleDate = (dateKey: string) => {
    if (!isLoaded) return;
    const willAdd = !checkins.includes(dateKey);
    const next = toggleCheckinDate(checkins, dateKey);
    updateCheckins(next);
    if (willAdd && dateKey === todayKey) {
      setBurstKey((prev) => prev + 1);
      triggerHaptic('success');
    } else {
      triggerHaptic('selection');
    }
  };

  const handleSelectTab = (tab: TabKey) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      triggerHaptic('selection');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.brand}>Gymcat</Text>
      </View>

      <View style={styles.content}>
        {activeTab === 'Today' && (
          <TodayScreen
            isCheckedInToday={isCheckedInToday}
            stage={summary.stageMeta.stage}
            stageName={summary.stageMeta.name}
            todayLabel={todayLabel}
            onCheckInToday={handleCheckInToday}
            onUndoToday={handleUndoToday}
          />
        )}

        {activeTab === 'Days' && (
          <MonthlyDaysScreen
            checkins={checkins}
            referenceDate={today}
            onToggleDate={handleToggleDate}
          />
        )}

        {activeTab === 'Card' && <MonthCardScreen summary={summary} />}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => handleSelectTab(tab.key)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ConfettiBurst burstKey={burstKey} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5FA',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0,
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
    marginBottom: 14,
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
