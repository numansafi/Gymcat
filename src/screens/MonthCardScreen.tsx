import React from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CatAvatar } from '../components/CatAvatar';
import { MonthlySummary } from '../types/gymcat';

interface MonthCardScreenProps {
  summary: MonthlySummary;
}

export function MonthCardScreen({ summary }: MonthCardScreenProps) {
  const { stageMeta } = summary;

  const handleShare = async () => {
    try {
      await Share.share({
        message: [
          `🐾 Gymcat — ${summary.monthLabel}`,
          `Boba evolved into: ${stageMeta.name} (${stageMeta.title})`,
          `🔥 Official Monthly Streak: ${summary.officialMonthlyStreak} day${summary.officialMonthlyStreak === 1 ? '' : 's'}`,
          `💪 Gym Days: ${summary.gymDays} · Consistency: ${summary.consistencyPercent}%`,
          `😴 Rest Days: ${summary.restDays}`,
        ].join('\n'),
      });
    } catch {
      // Ignore user-cancelled share sheet
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardEyebrow}>End-of-Month Reveal</Text>
          <Text style={styles.monthLabel}>{summary.monthLabel}</Text>
        </View>

        <View
          style={[
            styles.tierBadge,
            { backgroundColor: stageMeta.badgeBackground },
          ]}
        >
          <Text style={[styles.tierBadgeText, { color: stageMeta.accentColor }]}>
            {stageMeta.title}
          </Text>
        </View>

        <View style={styles.avatarWrap}>
          <CatAvatar stage={stageMeta.stage} size={188} />
        </View>

        <Text style={styles.stageName}>{stageMeta.name}</Text>
        <Text style={styles.stageDescription}>{stageMeta.description}</Text>

        <View style={styles.streakBanner}>
          <Text style={styles.streakLabel}>Official Monthly Streak</Text>
          <Text style={styles.streakValue}>
            {summary.officialMonthlyStreak}{' '}
            {summary.officialMonthlyStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{summary.consistencyPercent}%</Text>
            <Text style={styles.statLabel}>Consistency</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{summary.gymDays}</Text>
            <Text style={styles.statLabel}>Gym Days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{summary.restDays}</Text>
            <Text style={styles.statLabel}>Rest Days</Text>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.shareButton,
          pressed && styles.shareButtonPressed,
        ]}
        onPress={handleShare}
      >
        <Text style={styles.shareButtonText}>Share Monthly Card</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#162244',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2A3A68',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#A5B4D4',
  },
  monthLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },
  tierBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  avatarWrap: {
    marginVertical: 6,
  },
  stageName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 4,
  },
  stageDescription: {
    fontSize: 14,
    color: '#A5B4D4',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
    maxWidth: 270,
  },
  streakBanner: {
    width: '100%',
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#1E2D56',
    borderWidth: 1,
    borderColor: '#2A3A68',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D3DCF0',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFC2C7',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1E2D56',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 19,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A5B4D4',
    marginTop: 2,
  },
  shareButton: {
    marginTop: 18,
    backgroundColor: '#FFC2C7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  shareButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  shareButtonText: {
    color: '#101935',
    fontSize: 16,
    fontWeight: '800',
  },
});
