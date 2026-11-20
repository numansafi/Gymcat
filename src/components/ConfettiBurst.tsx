import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface ConfettiBurstProps {
  burstKey: number;
}

interface ParticleConfig {
  id: number;
  color: string;
  startXRatio: number;
  phaseOffset: number;
  swayX: number;
  rotateDeg: number;
  size: number;
}

const COLORS = ['#FFC2C7', '#FDE2B8', '#B8E0D2', '#C3DDFD', '#E2D4F0', '#F9BEC7'];
const PARTICLE_COUNT = 28;

interface ConfettiParticleProps {
  particle: ParticleConfig;
  progress: SharedValue<number>;
  screenWidth: number;
  screenHeight: number;
}

function ConfettiParticle({
  particle,
  progress,
  screenWidth,
  screenHeight,
}: ConfettiParticleProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const p = (progress.value + particle.phaseOffset) % 1;
    const translateY = interpolate(p, [0, 1], [-40, screenHeight + 40]);
    const translateX = Math.sin(p * Math.PI * 4) * particle.swayX;
    const rotate = `${interpolate(p, [0, 1], [0, particle.rotateDeg])}deg`;
    const opacity = interpolate(p, [0, 0.08, 0.88, 1], [0, 0.95, 0.95, 0]);

    return {
      opacity,
      transform: [{ translateX }, { translateY }, { rotate }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.startXRatio * screenWidth,
          top: 0,
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
  const progress = useSharedValue(0);

  const particles: ParticleConfig[] = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
      id: index,
      color: COLORS[index % COLORS.length],
      startXRatio: ((index * 37 + 13) % 96) / 100,
      phaseOffset: index / PARTICLE_COUNT,
      swayX: (index % 2 === 0 ? 1 : -1) * (12 + (index % 4) * 6),
      rotateDeg: (index % 2 === 0 ? 1 : -1) * (240 + (index % 4) * 90),
      size: 8 + (index % 3) * 3,
    }));
  }, []);

  useEffect(() => {
    if (burstKey === 0 || reducedMotion) return;
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, {
        duration: 4200,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
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
          screenWidth={width}
          screenHeight={height}
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
