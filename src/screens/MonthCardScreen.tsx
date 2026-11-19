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
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ECE5F7',
    shadowColor: '#2D2638',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cardEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#8D849B',
  },
  monthLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: '#231B2E',
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
    color: '#231B2E',
    marginTop: 4,
  },
  stageDescription: {
    fontSize: 14,
    color: '#6A6177',
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
    borderRadius: 20,
    backgroundColor: '#FAF7FF',
    borderWidth: 1,
    borderColor: '#ECE5F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#574E66',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#231B2E',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8F7FA',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 19,
    fontWeight: '800',
    color: '#231B2E',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C7287',
    marginTop: 2,
  },
  shareButton: {
    marginTop: 18,
    backgroundColor: '#231B2E',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#231B2E',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  shareButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
