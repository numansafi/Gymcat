import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

interface ConfettiBurstProps {
  burstKey: number;
}

interface ParticleConfig {
  id: number;
  color: string;
  targetX: number;
  targetY: number;
  rotateDeg: string;
  size: number;
  delay: number;
}

const COLORS = ['#F472B6', '#8B7CF6', '#FBBF24', '#10B981', '#38BDF8', '#FB7185'];
const PARTICLE_COUNT = 26;

export function ConfettiBurst({ burstKey }: ConfettiBurstProps) {
  const { width, height } = Dimensions.get('window');
  const originX = width / 2;
  const originY = height * 0.48;

  const [progressValues] = useState(() =>
    Array.from({ length: PARTICLE_COUNT }, () => new Animated.Value(0)),
  );

  const particles: ParticleConfig[] = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
      const angle = (Math.PI * 2 * index) / PARTICLE_COUNT + (index % 3) * 0.14;
      const distance = 90 + (index % 5) * 34;
      const spreadX = Math.cos(angle) * distance;
      const spreadY = Math.sin(angle) * distance - 50 + (index % 4) * 28;

      return {
        id: index,
        color: COLORS[index % COLORS.length],
        targetX: spreadX,
        targetY: spreadY,
        rotateDeg: `${(index % 2 === 0 ? 1 : -1) * (240 + (index % 4) * 90)}deg`,
        size: 8 + (index % 3) * 3,
        delay: (index % 4) * 18,
      };
    });
  }, []);

  useEffect(() => {
    if (burstKey === 0) return;

    progressValues.forEach((val) => val.setValue(0));

    const animations = progressValues.map((val, index) =>
      Animated.timing(val, {
        toValue: 1,
        duration: 820,
        delay: particles[index].delay,
        useNativeDriver: true,
      }),
    );

    Animated.parallel(animations).start();
  }, [burstKey, particles, progressValues]);

  if (burstKey === 0) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((particle, index) => {
        const progress = progressValues[index];

        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, particle.targetX],
        });

        const translateY = progress.interpolate({
          inputRange: [0, 0.45, 1],
          outputRange: [0, particle.targetY, particle.targetY + 120],
        });

        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', particle.rotateDeg],
        });

        const opacity = progress.interpolate({
          inputRange: [0, 0.15, 0.75, 1],
          outputRange: [0, 1, 1, 0],
        });

        const scale = progress.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [0.3, 1.15, 0.85],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: originX - particle.size / 2,
                top: originY - particle.size / 2,
                width: particle.size,
                height: particle.size * 0.65,
                backgroundColor: particle.color,
                opacity,
                transform: [{ translateX }, { translateY }, { rotate }, { scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 3,
  },
});
