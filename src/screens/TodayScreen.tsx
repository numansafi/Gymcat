import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CatSilhouette } from '../components/CatSilhouette';

interface TodayScreenProps {
  isCheckedInToday: boolean;
  todayLabel: string;
  onCheckInToday: () => void;
  onUndoToday: () => void;
}

export function TodayScreen({
  isCheckedInToday,
  todayLabel,
  onCheckInToday,
  onUndoToday,
}: TodayScreenProps) {
  const [restSelected, setRestSelected] = useState(false);
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isCheckedInToday && !reducedMotion) {
      scale.value = 0.96;
      scale.value = withTiming(1, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isCheckedInToday, reducedMotion, scale]);

  const silhouetteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isRestActive = !isCheckedInToday && restSelected;

  const handleWorkedOutPress = () => {
    setRestSelected(false);
    onCheckInToday();
  };

  const handleRestPress = () => {
    if (isCheckedInToday) {
      onUndoToday();
    }
    setRestSelected(true);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.dateText}>{todayLabel}</Text>

      <Animated.View style={[styles.silhouetteFrame, silhouetteStyle]}>
        <CatSilhouette active={isCheckedInToday} size={208} />
        <Text style={styles.statusText}>
          {isCheckedInToday
            ? 'WORKED OUT'
            : isRestActive
              ? 'REST DAY'
              : 'READY'}
        </Text>
      </Animated.View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: isCheckedInToday }}
          style={({ pressed }) => [
            styles.primaryButton,
            isCheckedInToday && styles.primaryButtonDone,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleWorkedOutPress}
        >
          <Text style={styles.primaryButtonText}>
            {isCheckedInToday ? 'WORKED OUT TODAY ✓' : 'WORKED OUT TODAY'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: isRestActive }}
          hitSlop={8}
          style={({ pressed }) => [
            styles.restButton,
            isRestActive && styles.restButtonActive,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleRestPress}
        >
          <Text
            style={[
              styles.restButtonText,
              isRestActive && styles.restButtonTextActive,
            ]}
          >
            REST
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#A5B4D4',
    textAlign: 'center',
    marginBottom: 18,
  },
  silhouetteFrame: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 320,
    aspectRatio: 1,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#2A3A68',
    backgroundColor: '#162244',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    padding: 16,
  },
  statusText: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: '#FFC2C7',
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#FFC2C7',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDone: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: '#101935',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  restButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#162244',
    borderWidth: 1,
    borderColor: '#2A3A68',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  restButtonActive: {
    borderColor: '#FFC2C7',
  },
  restButtonText: {
    color: '#A5B4D4',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  restButtonTextActive: {
    color: '#FFC2C7',
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});
