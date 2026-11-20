import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatDateKey, getMonthDaysCount } from '../storage/checkins';

interface MonthlyDaysScreenProps {
  checkins: string[];
  referenceDate?: Date;
  onToggleDate: (dateKey: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthlyDaysScreen({
  checkins,
  referenceDate = new Date(),
  onToggleDate,
}: MonthlyDaysScreenProps) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const todayDay = referenceDate.getDate();
  const daysInMonth = getMonthDaysCount(year, month);
  const firstWeekday = new Date(year, month, 1).getDay();
  const checkedSet = new Set(checkins);

  const monthTitle = referenceDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const cells: { day: number | null; key: string }[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ day: null, key: `pad-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(new Date(year, month, day));
    cells.push({ day, key: dateKey });
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.monthTitle}>{monthTitle}</Text>
      <Text style={styles.helperText}>
        Tap any day up to today to log or unlog a gym visit.
      </Text>

      <View style={styles.card}>
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((label) => (
            <Text key={label} style={styles.weekdayLabel}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((cell) => {
            if (cell.day === null) {
              return <View key={cell.key} style={styles.cellSpacer} />;
            }

            const isFuture = cell.day > todayDay;
            const isToday = cell.day === todayDay;
            const isChecked = checkedSet.has(cell.key);

            return (
              <Pressable
                key={cell.key}
                disabled={isFuture}
                accessibilityRole="button"
                accessibilityLabel={`Day ${cell.day}${isChecked ? ', gym day' : ''}${isToday ? ', today' : ''}`}
                accessibilityState={{ checked: isChecked, disabled: isFuture }}
                onPress={() => onToggleDate(cell.key)}
                style={({ pressed }) => [
                  styles.dayCell,
                  isChecked && styles.dayCellChecked,
                  isToday && !isChecked && styles.dayCellToday,
                  isFuture && styles.dayCellFuture,
                  pressed && !isFuture && styles.dayCellPressed,
                ]}
              >
                {isChecked ? (
                  <Text style={styles.pawText}>🐾</Text>
                ) : (
                  <Text
                    style={[
                      styles.dayNumber,
                      isToday && styles.dayNumberToday,
                      isFuture && styles.dayNumberFuture,
                    ]}
                  >
                    {cell.day}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <Text style={styles.legendPaw}>🐾</Text>
          <Text style={styles.legendText}>Gym day</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendRestDot} />
          <Text style={styles.legendText}>Rest day</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  helperText: {
    fontSize: 13,
    color: '#A5B4D4',
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#162244',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2A3A68',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayLabel: {
    width: '14.2857%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#A5B4D4',
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellSpacer: {
    width: '14.2857%',
    aspectRatio: 1,
    padding: 4,
  },
  dayCell: {
    width: '14.2857%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 2,
  },
  dayCellChecked: {
    backgroundColor: 'rgba(255, 194, 199, 0.20)',
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: '#FFC2C7',
  },
  dayCellFuture: {
    opacity: 0.35,
  },
  dayCellPressed: {
    transform: [{ scale: 0.92 }],
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D3DCF0',
  },
  dayNumberToday: {
    color: '#FFC2C7',
    fontWeight: '800',
  },
  dayNumberFuture: {
    color: '#63739B',
  },
  pawText: {
    fontSize: 18,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendPaw: {
    fontSize: 15,
  },
  legendRestDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2A3A68',
  },
  legendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A5B4D4',
  },
});
