import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ConfettiBurstProps {
  active: boolean;
}

interface ThrowParticleConfig {
  id: number;
  color: string;
  startOffsetX: number;
  spreadX: number;
  peakY: number;
  riseMs: number;
  swayX: number;
  rotateDeg: number;
  width: number;
  height: number;
  radius: number;
}

interface RainParticleConfig {
  id: number;
  color: string;
  startXRatio: number;
  startDelayMs: number;
  speedFactor: number;
  swayX: number;
  rotateDeg: number;
  width: number;
  height: number;
  radius: number;
}

const COLORS = ['#D8B4FE', '#E9D5FF', '#FDE2B8', '#B8E0D2', '#C3DDFD', '#FFC2C7'];
const THROW_COUNT = 70;
const RAIN_COUNT = 70;
const TRICKLE_COUNT = 75;
const FALL_CYCLE_MS = 6200;
const TRICKLE_CYCLE_MS = 10500;
const TRICKLE_CYCLES = 10000;
const TOTAL_SHOW_MS = 15500;
const FALL_RAMP_MS = 350;

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function getParticleShape(index: number) {
  const bucket = index % 6;
  if (bucket === 0 || bucket === 3) {
    return { width: 7, height: 7, radius: 999 };
  }
  if (bucket === 5) {
    const width = index % 2 === 0 ? 16 : 19;
    return { width, height: 6.5, radius: 2.5 };
  }
  const width = bucket === 1 ? 10 : 12;
  return { width, height: width * 0.65, radius: 2.5 };
}

function ThrowParticle({
  particle,
  elapsedMs,
  originX,
  originY,
  screenHeight,
}: {
  particle: ThrowParticleConfig;
  elapsedMs: SharedValue<number>;
  originX: number;
  originY: number;
  screenHeight: number;
}) {
  const fallSpeedPerMs = (screenHeight + 80) / FALL_CYCLE_MS;

  const animatedStyle = useAnimatedStyle(() => {
    const tMs = elapsedMs.value;
    if (tMs <= 0 || tMs >= TOTAL_SHOW_MS) {
      return { opacity: 0 };
    }

    const riseProgress = tMs < particle.riseMs ? tMs / particle.riseMs : 1;
    const inv = 1 - riseProgress;
    const dragX = 1 - inv * inv;
    const swayPhase = (tMs / FALL_CYCLE_MS) * Math.PI * 4;
    const translateX = particle.spreadX * dragX + Math.sin(swayPhase) * particle.swayX;

    let translateY: number;
    if (tMs <= particle.riseMs) {
      translateY = particle.peakY * (1 - inv * inv);
    } else {
      const fallMs = tMs - particle.riseMs;
      const fallDist =
        fallMs < FALL_RAMP_MS
          ? (0.5 * fallSpeedPerMs * fallMs * fallMs) / FALL_RAMP_MS
          : fallSpeedPerMs * (fallMs - FALL_RAMP_MS / 2);
      translateY = particle.peakY + fallDist;
    }

    const rotate = `${(tMs / FALL_CYCLE_MS) * particle.rotateDeg}deg`;
    const scale = 0.6 + 0.4 * riseProgress;
    const yOnScreen = originY + translateY;
    const opacity = yOnScreen > screenHeight + 40 ? 0 : tMs < 80 ? tMs / 80 : 1;

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
          left: originX + particle.startOffsetX - particle.width / 2,
          top: originY - particle.height / 2,
          width: particle.width,
          height: particle.height,
          borderRadius: particle.radius,
          backgroundColor: particle.color,
        },
        animatedStyle,
      ]}
    />
  );
}

function RainParticle({
  particle,
  elapsedMs,
  screenWidth,
  screenHeight,
}: {
  particle: RainParticleConfig;
  elapsedMs: SharedValue<number>;
  screenWidth: number;
  screenHeight: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const localMs = elapsedMs.value - particle.startDelayMs;
    const durationMs = FALL_CYCLE_MS / particle.speedFactor;
    if (localMs <= 0 || localMs >= durationMs) {
      return { opacity: 0 };
    }

    const p = localMs / durationMs;
    const translateY = -40 + p * (screenHeight + 80);
    const translateX = Math.sin(p * Math.PI * 4) * particle.swayX;
    const rotate = `${p * particle.rotateDeg}deg`;
    const opacity = p < 0.04 ? p / 0.04 : p > 0.92 ? (1 - p) / 0.08 : 0.92;

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
          width: particle.width,
          height: particle.height,
          borderRadius: particle.radius,
          backgroundColor: particle.color,
        },
        animatedStyle,
      ]}
    />
  );
}

function TrickleParticle({
  particle,
  trickleTotal,
  screenWidth,
  screenHeight,
}: {
  particle: RainParticleConfig;
  trickleTotal: SharedValue<number>;
  screenWidth: number;
  screenHeight: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const elapsed = trickleTotal.value - particle.startDelayMs;
    if (elapsed < 0) {
      return { opacity: 0 };
    }
    const p = elapsed % 1;
    const translateY = -40 + p * (screenHeight + 80);
    const translateX = Math.sin(p * Math.PI * 4) * particle.swayX;
    const rotate = `${p * particle.rotateDeg}deg`;
    const opacity = p < 0.04 ? p / 0.04 : p > 0.92 ? (1 - p) / 0.08 : 0.85;

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
          width: particle.width,
          height: particle.height,
          borderRadius: particle.radius,
          backgroundColor: particle.color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ConfettiBurst({ active }: ConfettiBurstProps) {
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const elapsedMs = useSharedValue(TOTAL_SHOW_MS);
  const trickleTotal = useSharedValue(0);
  const prevActiveRef = useRef(active);

  const throwParticles = useMemo<ThrowParticleConfig[]>(() => {
    return Array.from({ length: THROW_COUNT }, (_, index) => {
      const r1 = seededRandom(index + 1);
      const r2 = seededRandom(index + 101);
      const r3 = seededRandom(index + 203);
      const r4 = seededRandom(index + 307);
      const r5 = seededRandom(index + 409);

      // Bias ~1/3 of thrown pieces near the top edge so they blend directly into top rain
      const peakRatio = index % 3 === 0 ? 0.7 + r1 * 0.2 : 0.16 + r1 * 0.68;
      const peakY = -height * peakRatio;
      const riseMs = 1000 + Math.round(r2 * 600);
      const spreadX = (r3 * 2 - 1) * width * 0.54;
      const startOffsetX = (r4 * 2 - 1) * 110;
      const spinDir = r5 > 0.5 ? 1 : -1;

      return {
        id: index,
        color: COLORS[index % COLORS.length],
        startOffsetX,
        spreadX,
        peakY,
        riseMs,
        swayX: spinDir * (6 + r4 * 12),
        rotateDeg: spinDir * (180 + r2 * 240),
        ...getParticleShape(index),
      };
    });
  }, [height, width]);

  const rainParticles = useMemo<RainParticleConfig[]>(() => {
    return Array.from({ length: RAIN_COUNT }, (_, index) => {
      const r1 = seededRandom(index + 501);
      const r2 = seededRandom(index + 607);
      const r3 = seededRandom(index + 709);
      const r4 = seededRandom(index + 811);
      const spinDir = r4 > 0.5 ? 1 : -1;

      return {
        id: index,
        color: COLORS[index % COLORS.length],
        startXRatio: r1 * 0.96,
        // Start at 1000ms to overlap thrown apex, then taper out slowly to 7.8s
        startDelayMs: 1000 + r2 * r2 * 6800,
        speedFactor: 0.82 + r3 * 0.36,
        swayX: spinDir * (8 + r4 * 10),
        rotateDeg: spinDir * (180 + r3 * 220),
        ...getParticleShape(index),
      };
    });
  }, []);

  const trickleParticles = useMemo<RainParticleConfig[]>(() => {
    return Array.from({ length: TRICKLE_COUNT }, (_, index) => {
      const r1 = seededRandom(index + 907);
      const r2 = seededRandom(index + 1009);
      const r3 = seededRandom(index + 1103);
      const spinDir = r3 > 0.5 ? 1 : -1;

      return {
        id: index,
        color: COLORS[index % COLORS.length],
        startXRatio: r1 * 0.96,
        startDelayMs: 0.45 + index / TRICKLE_COUNT,
        speedFactor: 1,
        swayX: spinDir * (8 + r2 * 10),
        rotateDeg: spinDir * (180 + r2 * 200),
        ...getParticleShape(index),
      };
    });
  }, []);

  useEffect(() => {
    const wasActive = prevActiveRef.current;
    prevActiveRef.current = active;

    if (!active || reducedMotion) {
      cancelAnimation(elapsedMs);
      cancelAnimation(trickleTotal);
      elapsedMs.value = TOTAL_SHOW_MS;
      trickleTotal.value = 0;
      return;
    }

    if (!wasActive) {
      elapsedMs.value = 0;
      elapsedMs.value = withTiming(TOTAL_SHOW_MS, {
        duration: TOTAL_SHOW_MS,
        easing: Easing.linear,
      });

      trickleTotal.value = 0;
      trickleTotal.value = withTiming(TRICKLE_CYCLES, {
        duration: TRICKLE_CYCLE_MS * TRICKLE_CYCLES,
        easing: Easing.linear,
      });
    } else {
      // Already checked in today (e.g., app reopen): continue slow trickle
      trickleTotal.value = 1;
      trickleTotal.value = withTiming(1 + TRICKLE_CYCLES, {
        duration: TRICKLE_CYCLE_MS * TRICKLE_CYCLES,
        easing: Easing.linear,
      });
    }

    return () => {
      cancelAnimation(elapsedMs);
      cancelAnimation(trickleTotal);
    };
  }, [active, elapsedMs, reducedMotion, trickleTotal]);

  if (reducedMotion) {
    return null;
  }

  const buttonOriginX = width / 2;
  const buttonOriginY = height * 0.7;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {throwParticles.map((particle) => (
        <ThrowParticle
          key={`throw-${particle.id}`}
          particle={particle}
          elapsedMs={elapsedMs}
          originX={buttonOriginX}
          originY={buttonOriginY}
          screenHeight={height}
        />
      ))}
      {rainParticles.map((particle) => (
        <RainParticle
          key={`rain-${particle.id}`}
          particle={particle}
          elapsedMs={elapsedMs}
          screenWidth={width}
          screenHeight={height}
        />
      ))}
      {trickleParticles.map((particle) => (
        <TrickleParticle
          key={`trickle-${particle.id}`}
          particle={particle}
          trickleTotal={trickleTotal}
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
  },
});
