import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface CatSilhouetteProps {
  active?: boolean;
  size?: number;
}

export function CatSilhouette({ active = false, size = 196 }: CatSilhouetteProps) {
  const stroke = '#FF7E79';
  const fill = active ? 'rgba(255, 126, 121, 0.16)' : 'rgba(255, 126, 121, 0.04)';

  return (
    <Svg width={size} height={size} viewBox="0 0 200 220">
      {/* Standing cat head & ears silhouette outline */}
      <Path
        d="M 80 56 L 72 28 L 92 44 Q 100 42 108 44 L 128 28 L 120 56"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="100"
        cy="66"
        r="24"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Standing athletic cat body, arms, waist, and legs outline */}
      <Path
        d={[
          'M 89 90',
          'Q 74 96 64 114',
          'L 48 148',
          'Q 45 154 51 156',
          'Q 57 157 60 151',
          'L 74 122',
          'Q 79 132 76 146',
          'Q 72 162 76 184',
          'L 76 202',
          'Q 68 206 68 210',
          'L 90 210',
          'L 94 166',
          'Q 100 162 106 166',
          'L 110 210',
          'L 132 210',
          'Q 132 206 124 202',
          'L 124 184',
          'Q 128 162 124 146',
          'Q 121 132 126 122',
          'L 140 151',
          'Q 143 157 149 156',
          'Q 155 154 152 148',
          'L 136 114',
          'Q 126 96 111 90',
          'Z',
        ].join(' ')}
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
