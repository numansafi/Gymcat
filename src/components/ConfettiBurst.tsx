import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ConfettiBurstProps {
  burstKey: number;
}

interface ParticleConfig {
  id: number;
  color: string;
  targetX: number;
  targetY: number;
  rotateDeg: number;
  size: number;
}

const COLORS = ['#FF7E79', '#FCA5A5', '#FDE68A', '#93C5FD', '#F8FAFC', '#FB7185'];
const PARTICLE_COUNT = 26;

interface ConfettiParticleProps {
  particle: ParticleConfig;
  progress: SharedValue<number>;
  originX: number;
  originY: number;
}

function ConfettiParticle({
  particle,
  progress,
  originX,
  originY,
}: ConfettiParticleProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const translateX = interpolate(p, [0, 1], [0, particle.targetX]);
    const translateY = interpolate(
      p,
      [0, 0.45, 1],
      [0, particle.targetY, particle.targetY + 120],
    );
    const rotate = `${interpolate(p, [0, 1], [0, particle.rotateDeg])}deg`;
    const opacity = interpolate(p, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
    const scale = interpolate(p, [0, 0.2, 1], [0.3, 1.15, 0.85]);

    return {
      opacity,
      transform: [{ translateX }, { translateY }, { rotate }, { scale }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: originX - particle.size / 2,
          top: originY - particle.size / 2,
          width: particle.size,
          height: particle.size * 0.65,
          backgroundColor: particle.color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ConfettiBurst({ burstKey }: ConfettiBurstProps) {
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const originX = width / 2;
  const originY = height * 0.48;
  const progress = useSharedValue(0);

  const particles: ParticleConfig[] = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
      const angle = (Math.PI * 2 * index) / PARTICLE_COUNT + (index % 3) * 0.14;
      const distance = 90 + (index % 5) * 34;
      return {
        id: index,
        color: COLORS[index % COLORS.length],
        targetX: Math.cos(angle) * distance,
        targetY: Math.sin(angle) * distance - 50 + (index % 4) * 28,
        rotateDeg: (index % 2 === 0 ? 1 : -1) * (240 + (index % 4) * 90),
        size: 8 + (index % 3) * 3,
      };
    });
  }, []);

  useEffect(() => {
    if (burstKey === 0 || reducedMotion) return;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 820,
      easing: Easing.out(Easing.cubic),
    });
  }, [burstKey, progress, reducedMotion]);

  if (burstKey === 0 || reducedMotion) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          particle={particle}
          progress={progress}
          originX={originX}
          originY={originY}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 3,
  },
});
