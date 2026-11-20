import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CatSilhouetteProps {
  active?: boolean;
  size?: number;
}

export function CatSilhouette({ active = false, size = 196 }: CatSilhouetteProps) {
  const stroke = '#D8B4FE';
  const fill = active ? 'rgba(216, 180, 254, 0.20)' : 'rgba(216, 180, 254, 0.05)';

  return (
    <Svg width={size} height={size} viewBox="0 0 200 220">
      {/* Continuous standing cat silhouette outline (ears, head, tail, paws) */}
      <Path
        d={[
          'M 78 52',
          'L 68 20',
          'L 91 40',
          'Q 100 38 109 40',
          'L 132 20',
          'L 122 52',
          'Q 129 64 123 76',
          'Q 118 85 111 89',
          'Q 127 96 137 115',
          'L 151 148',
          'Q 154 155 148 157',
          'Q 142 158 139 151',
          'L 126 123',
          'Q 123 135 125 148',
          'Q 138 144 152 132',
          'Q 166 118 164 100',
          'Q 163 90 156 92',
          'Q 152 94 154 104',
          'Q 156 118 144 129',
          'Q 134 138 125 140',
          'Q 127 162 124 184',
          'L 124 202',
          'Q 133 206 133 211',
          'L 110 211',
          'L 106 167',
          'Q 100 163 94 167',
          'L 90 211',
          'L 67 211',
          'Q 67 206 76 202',
          'L 76 184',
          'Q 73 162 76 146',
          'Q 79 132 74 123',
          'L 61 151',
          'Q 58 158 52 157',
          'Q 46 155 49 148',
          'L 63 115',
          'Q 73 96 89 89',
          'Q 82 85 77 76',
          'Q 71 64 78 52',
          'Z',
        ].join(' ')}
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle cat whiskers on silhouette */}
      <Path
        d="M 62 66 L 76 68 M 60 74 L 76 73 M 138 66 L 124 68 M 140 74 L 124 73"
        fill="none"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity={0.85}
      />
    </Svg>
  );
}
