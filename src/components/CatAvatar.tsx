import React from 'react';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect } from 'react-native-svg';
import { CatStage } from '../types/gymcat';

interface CatAvatarProps {
  stage: CatStage;
  size?: number;
}

export function CatAvatar({ stage, size = 160 }: CatAvatarProps) {
  const furColor = stage === 4 ? '#FFF3D6' : '#FFF8EE';
  const earInner = stage >= 3 ? '#F472B6' : '#FBCFE8';
  const outline = '#2D2638';

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* Stage 4 Giga-Cat Aura */}
      {stage === 4 && (
        <>
          <Circle cx="100" cy="105" r="88" fill="#FCE7F3" opacity={0.65} />
          <Circle
            cx="100"
            cy="105"
            r="78"
            fill="none"
            stroke="#EC4899"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
        </>
      )}

      {/* Stage 3 Athletic Aura */}
      {stage === 3 && (
        <Circle cx="100" cy="108" r="80" fill="#D1FAE5" opacity={0.55} />
      )}

      {/* Stage 2 Warmed Up Aura */}
      {stage === 2 && (
        <Circle cx="100" cy="108" r="76" fill="#FEF3C7" opacity={0.55} />
      )}

      {/* Stage 1 Fluff Pup Aura */}
      {stage === 1 && (
        <Circle cx="100" cy="108" r="72" fill="#F1EEFF" opacity={0.65} />
      )}

      {/* Tail */}
      <Path
        d="M 145 148 Q 178 140 170 112 Q 165 98 154 106"
        fill="none"
        stroke={outline}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <Path
        d="M 145 148 Q 178 140 170 112 Q 165 98 154 106"
        fill="none"
        stroke={furColor}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Body */}
      <Ellipse
        cx="100"
        cy="138"
        rx={stage >= 3 ? 46 : 42}
        ry={stage >= 3 ? 40 : 36}
        fill={furColor}
        stroke={outline}
        strokeWidth="4"
      />

      {/* Stage 3 & 4 Athletic Tank Top */}
      {stage >= 3 && (
        <Path
          d="M 64 128 Q 100 138 136 128 L 140 165 Q 100 176 60 165 Z"
          fill={stage === 4 ? '#EC4899' : '#10B981'}
          stroke={outline}
          strokeWidth="3.5"
        />
      )}

      {/* Left & Right Ears */}
      <Polygon
        points="54,76 46,34 84,56"
        fill={furColor}
        stroke={outline}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <Polygon points="58,70 53,44 77,58" fill={earInner} />

      <Polygon
        points="146,76 154,34 116,56"
        fill={furColor}
        stroke={outline}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <Polygon points="142,70 147,44 123,58" fill={earInner} />

      {/* Head */}
      <Ellipse
        cx="100"
        cy="88"
        rx="48"
        ry="42"
        fill={furColor}
        stroke={outline}
        strokeWidth="4"
      />

      {/* Stage 2 Sweatband */}
      {stage === 2 && (
        <Path
          d="M 55 68 Q 100 58 145 68 L 147 78 Q 100 68 53 78 Z"
          fill="#F59E0B"
          stroke={outline}
          strokeWidth="3"
        />
      )}

      {/* Stage 4 Crown */}
      {stage === 4 && (
        <Polygon
          points="76,48 82,24 94,38 100,20 106,38 118,24 124,48"
          fill="#FBBF24"
          stroke={outline}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}

      {/* Eyes */}
      <Circle cx="81" cy="88" r="6.5" fill={outline} />
      <Circle cx="119" cy="88" r="6.5" fill={outline} />
      <Circle cx="79" cy="86" r="2.2" fill="#FFFFFF" />
      <Circle cx="117" cy="86" r="2.2" fill="#FFFFFF" />

      {/* Blush */}
      <Ellipse cx="68" cy="98" rx="7" ry="4" fill="#F9A8D4" opacity={0.75} />
      <Ellipse cx="132" cy="98" rx="7" ry="4" fill="#F9A8D4" opacity={0.75} />

      {/* Nose & Mouth */}
      <Polygon points="96,95 104,95 100,100" fill="#F472B6" />
      <Path
        d="M 92 104 Q 96 109 100 103 Q 104 109 108 104"
        fill="none"
        stroke={outline}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Whiskers */}
      <Line x1="42" y1="90" x2="60" y2="93" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="40" y1="99" x2="59" y2="99" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="140" y1="93" x2="158" y2="90" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="141" y1="99" x2="160" y2="99" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />

      {/* Paws / Props by Stage */}
      {stage === 1 && (
        <>
          <Ellipse cx="76" cy="144" rx="10" ry="8" fill={furColor} stroke={outline} strokeWidth="3.5" />
          <Ellipse cx="124" cy="144" rx="10" ry="8" fill={furColor} stroke={outline} strokeWidth="3.5" />
        </>
      )}

      {stage === 2 && (
        <>
          {/* Small Dumbbell in right paw */}
          <Line x1="132" y1="126" x2="154" y2="118" stroke={outline} strokeWidth="5" strokeLinecap="round" />
          <Rect x="125" y="120" width="8" height="16" rx="3" fill="#64748B" stroke={outline} strokeWidth="2.5" />
          <Rect x="150" y="110" width="8" height="16" rx="3" fill="#64748B" stroke={outline} strokeWidth="2.5" />
          <Ellipse cx="74" cy="144" rx="10" ry="8" fill={furColor} stroke={outline} strokeWidth="3.5" />
          <Ellipse cx="136" cy="130" rx="10" ry="8" fill={furColor} stroke={outline} strokeWidth="3.5" />
        </>
      )}

      {stage === 3 && (
        <>
          {/* Barbell overhead */}
          <Line x1="36" y1="44" x2="164" y2="44" stroke={outline} strokeWidth="5" strokeLinecap="round" />
          <Rect x="28" y="30" width="12" height="28" rx="4" fill="#334155" stroke={outline} strokeWidth="2.5" />
          <Rect x="160" y="30" width="12" height="28" rx="4" fill="#334155" stroke={outline} strokeWidth="2.5" />
          <Ellipse cx="68" cy="126" rx="10" ry="8" fill={furColor} stroke={outline} strokeWidth="3.5" />
          <Ellipse cx="132" cy="126" rx="10" ry="8" fill={furColor} stroke={outline} strokeWidth="3.5" />
        </>
      )}

      {stage === 4 && (
        <>
          {/* Twin Golden Dumbbells */}
          <Line x1="28" y1="122" x2="54" y2="122" stroke={outline} strokeWidth="5" strokeLinecap="round" />
          <Rect x="22" y="110" width="10" height="24" rx="3" fill="#FBBF24" stroke={outline} strokeWidth="2.5" />
          <Rect x="48" y="110" width="10" height="24" rx="3" fill="#FBBF24" stroke={outline} strokeWidth="2.5" />

          <Line x1="146" y1="122" x2="172" y2="122" stroke={outline} strokeWidth="5" strokeLinecap="round" />
          <Rect x="142" y="110" width="10" height="24" rx="3" fill="#FBBF24" stroke={outline} strokeWidth="2.5" />
          <Rect x="168" y="110" width="10" height="24" rx="3" fill="#FBBF24" stroke={outline} strokeWidth="2.5" />

          <Ellipse cx="58" cy="126" rx="10" ry="8" fill={furColor} stroke={outline} strokeWidth="3.5" />
          <Ellipse cx="142" cy="126" rx="10" ry="8" fill={furColor} stroke={outline} strokeWidth="3.5" />
        </>
      )}
    </Svg>
  );
}
