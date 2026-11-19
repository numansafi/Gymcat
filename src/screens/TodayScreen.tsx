import React, { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CatAvatar } from '../components/CatAvatar';
import { CatStage } from '../types/gymcat';

interface TodayScreenProps {
  isCheckedInToday: boolean;
  stage: CatStage;
  stageName: string;
  todayLabel: string;
  onCheckInToday: () => void;
  onUndoToday: () => void;
}

export function TodayScreen({
  isCheckedInToday,
  stage,
  stageName,
  todayLabel,
  onCheckInToday,
  onUndoToday,
}: TodayScreenProps) {
  const [popScale] = useState(
    () => new Animated.Value(isCheckedInToday ? 1 : 0.7),
  );

  useEffect(() => {
    if (isCheckedInToday) {
      popScale.setValue(0.6);
      Animated.spring(popScale, {
        toValue: 1,
        friction: 5,
        tension: 110,
        useNativeDriver: true,
      }).start();
    } else {
      popScale.setValue(0.7);
    }
  }, [isCheckedInToday, popScale]);

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{todayLabel}</Text>
      <Text style={styles.headline}>
        {isCheckedInToday ? 'Boba is checked in!' : 'Ready for today?'}
      </Text>
      <Text style={styles.subtitle}>
        {isCheckedInToday
          ? `${stageName} · Zero guilt, one day at a time.`
          : 'Show up when you can. Rest days are part of the plan.'}
      </Text>

      <View style={styles.slotWrapper}>
        {isCheckedInToday ? (
          <Animated.View
            style={[
              styles.activeSlot,
              {
                transform: [{ scale: popScale }],
              },
            ]}
          >
            <CatAvatar stage={stage} size={176} />
            <View style={styles.checkedPill}>
              <Text style={styles.checkedPillText}>🐾 Checked in today</Text>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.emptyEmoji}>🐾</Text>
            <Text style={styles.emptyText}>Log today to check in Boba</Text>
          </View>
        )}
      </View>

      {!isCheckedInToday ? (
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={onCheckInToday}
        >
          <Text style={styles.primaryButtonText}>I Went to the Gym Today!</Text>
        </Pressable>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.undoButton,
            pressed && styles.undoButtonPressed,
          ]}
          onPress={onUndoToday}
        >
          <Text style={styles.undoButtonText}>Undo today&apos;s check-in</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#7C7287',
    marginBottom: 8,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#231B2E',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6A6177',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 21,
    maxWidth: 290,
  },
  slotWrapper: {
    marginVertical: 32,
    width: 248,
    height: 248,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlot: {
    width: 236,
    height: 236,
    borderRadius: 36,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderColor: '#C9BFE0',
    backgroundColor: '#FAF7FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 34,
    marginBottom: 12,
    opacity: 0.75,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A708B',
    textAlign: 'center',
    lineHeight: 22,
  },
  activeSlot: {
    width: 244,
    height: 244,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#ECE5F7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D2638',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  checkedPill: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#EEF9F3',
  },
  checkedPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F8A5F',
  },
  primaryButton: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#231B2E',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#231B2E',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  undoButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  undoButtonPressed: {
    opacity: 0.6,
  },
  undoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#887E96',
  },
});
