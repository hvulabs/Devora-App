import React from "react";
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

// "Pol" — Devora's friendly graduate mascot, drawn as vectors so it is crisp
// on every screen density and needs no bundled image asset.
export function Mascot({ size = 200 }: { size?: number }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#B9A7FF" />
          <Stop offset="1" stopColor="#8B6FEF" />
        </LinearGradient>
        <LinearGradient id="cap" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#5B4BD6" />
          <Stop offset="1" stopColor="#3A2EA6" />
        </LinearGradient>
      </Defs>

      {/* fluffy body */}
      <G>
        {/* arms */}
        <Ellipse cx="44" cy="118" rx="20" ry="26" fill="url(#body)" transform="rotate(-24 44 118)" />
        <Ellipse cx="158" cy="120" rx="18" ry="24" fill="url(#body)" transform="rotate(20 158 120)" />
        {/* feet */}
        <Ellipse cx="78" cy="170" rx="16" ry="12" fill="#9A82F0" />
        <Ellipse cx="122" cy="170" rx="16" ry="12" fill="#9A82F0" />
        {/* main body */}
        <Path
          d="M100 46 C140 46 162 78 162 118 C162 156 136 176 100 176 C64 176 38 156 38 118 C38 78 60 46 100 46 Z"
          fill="url(#body)"
        />
        {/* belly */}
        <Ellipse cx="100" cy="132" rx="34" ry="30" fill="#F1ECFF" />
      </G>

      {/* eyes */}
      <Circle cx="82" cy="104" r="14" fill="#FFFFFF" />
      <Circle cx="118" cy="104" r="14" fill="#FFFFFF" />
      <Circle cx="85" cy="106" r="7" fill="#201A3D" />
      <Circle cx="121" cy="106" r="7" fill="#201A3D" />
      <Circle cx="88" cy="103" r="2.3" fill="#FFFFFF" />
      <Circle cx="124" cy="103" r="2.3" fill="#FFFFFF" />

      {/* nose + smile */}
      <Ellipse cx="100" cy="120" rx="6" ry="5" fill="#6B54C8" />
      <Path
        d="M86 128 Q100 142 114 128"
        stroke="#4B3AA0"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* graduation cap */}
      <G>
        <Path d="M100 44 L150 60 L100 76 L50 60 Z" fill="url(#cap)" />
        <Rect x="76" y="66" width="48" height="16" rx="4" fill="#4A3AC0" />
        <Path d="M150 60 L150 86" stroke="#F6C445" strokeWidth="3" strokeLinecap="round" />
        <Circle cx="150" cy="88" r="4.5" fill="#F6C445" />
      </G>
    </Svg>
  );
}

// Compact monochrome mark for headers / tab bar.
export function MascotBadge({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <LinearGradient id="mb" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7C4DFF" />
          <Stop offset="1" stopColor="#4F46E5" />
        </LinearGradient>
      </Defs>
      <Rect x="2" y="2" width="44" height="44" rx="12" fill="url(#mb)" />
      <Path d="M18 16 L12 24 L18 32" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M30 16 L36 24 L30 32" stroke="#FCD34D" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M26 14 L22 34" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}
