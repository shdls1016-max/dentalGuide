'use client';

import React, { useState } from 'react';

interface ToothMapProps {
  selectedTooth: number | null;
  onSelectTooth: (toothNumber: number) => void;
  symptomTeeth: Map<number, string[]>;
}

/* FDI tooth numbers as the viewer sees them (looking into the mouth) */
const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

/** Tooth dimensions based on arch index (0=left edge, 15=right edge) */
function getToothDimensions(archIndex: number) {
  // Distance from center (0=central incisor .. 7=3rd molar)
  const dist = archIndex <= 7 ? 7 - archIndex : archIndex - 8;
  const table: Record<number, { w: number; h: number; r: number }> = {
    0: { w: 13, h: 17, r: 3.5 },  // central incisor
    1: { w: 12, h: 16, r: 3 },    // lateral incisor
    2: { w: 12, h: 18, r: 2.5 },  // canine
    3: { w: 14, h: 16, r: 3 },    // 1st premolar
    4: { w: 15, h: 16, r: 3 },    // 2nd premolar
    5: { w: 17, h: 17, r: 3.5 },  // 1st molar
    6: { w: 17, h: 17, r: 3.5 },  // 2nd molar
    7: { w: 15, h: 16, r: 3 },    // 3rd molar (wisdom)
  };
  return table[dist] ?? { w: 13, h: 15, r: 3 };
}

/** Position tooth along an elliptical arch */
function getToothPosition(index: number, isUpper: boolean) {
  const t = index / 15; // 0..1

  if (isUpper) {
    // Upper arch: elliptical path from 162 deg to 18 deg
    const angle = ((162 - t * 144) * Math.PI) / 180;
    return {
      x: 160 + 118 * Math.cos(angle),
      y: 52 + 72 * Math.sin(angle),
      rot: ((angle * 180) / Math.PI - 90) * 0.28,
    };
  } else {
    // Lower arch: elliptical path from 198 deg to 342 deg
    const angle = ((198 + t * 144) * Math.PI) / 180;
    return {
      x: 160 + 118 * Math.cos(angle),
      y: 248 + 72 * Math.sin(angle),
      rot: ((angle * 180) / Math.PI - 270) * 0.28,
    };
  }
}

/** Build a horseshoe-shaped gum background path */
function buildGumPath(isUpper: boolean): string {
  const cy = isUpper ? 52 : 248;
  const startDeg = isUpper ? 166 : 194;
  const endDeg = isUpper ? 14 : 346;
  const outerRx = 133, outerRy = 85;
  const innerRx = 105, innerRy = 55;
  const n = 48;

  const outer: [number, number][] = [];
  const inner: [number, number][] = [];

  for (let i = 0; i <= n; i++) {
    const deg = startDeg + (i / n) * (endDeg - startDeg);
    const rad = (deg * Math.PI) / 180;
    outer.push([160 + outerRx * Math.cos(rad), cy + outerRy * Math.sin(rad)]);
    inner.push([160 + innerRx * Math.cos(rad), cy + innerRy * Math.sin(rad)]);
  }

  inner.reverse();
  const pts = [...outer, ...inner];
  return (
    `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} ` +
    pts.slice(1).map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
    ' Z'
  );
}

export default function ToothMap({ selectedTooth, onSelectTooth, symptomTeeth }: ToothMapProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  /** Render a single tooth */
  const renderTooth = (num: number, idx: number, upper: boolean) => {
    const { x, y, rot } = getToothPosition(idx, upper);
    const { w, h, r } = getToothDimensions(idx);

    const isSel = selectedTooth === num;
    const hasSym = symptomTeeth.has(num);
    const isHov = hovered === num;

    // Colours
    let fill = '#EDF1F5';
    let stroke = '#C8D0D8';
    if (isSel) {
      fill = 'var(--color-primary)';
      stroke = 'var(--color-primary-dark)';
    } else if (hasSym) {
      fill = '#FFE0B2';
      stroke = 'var(--color-warning)';
    } else if (isHov) {
      fill = '#D6E7FA';
      stroke = 'var(--color-primary-light)';
    }

    // Invisible larger tap target (min ~28px SVG units)
    const tap = 28;

    return (
      <g
        key={num}
        style={{ cursor: 'pointer' }}
        onClick={() => onSelectTooth(num)}
        onMouseEnter={() => setHovered(num)}
        onMouseLeave={() => setHovered(null)}
        role="button"
        aria-label={`${num}번 치아`}
      >
        {/* Invisible tap target */}
        <rect
          x={x - tap / 2}
          y={y - tap / 2}
          width={tap}
          height={tap}
          fill="transparent"
          transform={`rotate(${rot},${x},${y})`}
        />
        {/* Visible tooth shape */}
        <rect
          x={x - w / 2}
          y={y - h / 2}
          width={w}
          height={h}
          rx={r}
          ry={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={isSel || isHov ? 1.6 : 1}
          transform={`rotate(${rot},${x},${y})`}
          style={{ transition: 'fill 0.15s ease, stroke 0.15s ease' }}
        />
        {/* Orange symptom dot */}
        {hasSym && !isSel && (
          <circle
            cx={x + w / 2 - 1}
            cy={y - h / 2 + 1}
            r={2.8}
            fill="var(--color-warning)"
            stroke="#fff"
            strokeWidth={0.8}
            style={{ pointerEvents: 'none' }}
          />
        )}
      </g>
    );
  };

  /** Render tooth number labels */
  const renderNumberLabels = (teeth: number[], upper: boolean) =>
    teeth.map((num, i) => {
      const { x, y } = getToothPosition(i, upper);
      const { h } = getToothDimensions(i);
      return (
        <text
          key={`n-${num}`}
          x={x}
          y={upper ? y + h / 2 + 10 : y - h / 2 - 5}
          textAnchor="middle"
          fontSize="6"
          fill="var(--color-text-tertiary)"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {num}
        </text>
      );
    });

  /** Render hover tooltip */
  const renderTooltip = () => {
    if (hovered === null) return null;
    const upper = UPPER_TEETH.includes(hovered);
    const arr = upper ? UPPER_TEETH : LOWER_TEETH;
    const idx = arr.indexOf(hovered);
    if (idx < 0) return null;

    const { x, y } = getToothPosition(idx, upper);
    const { h } = getToothDimensions(idx);
    const ty = upper ? y - h / 2 - 18 : y + h / 2 + 18;
    const label = `${hovered}번`;

    return (
      <g style={{ pointerEvents: 'none' }}>
        <rect
          x={x - 18}
          y={ty - 10}
          width={36}
          height={20}
          rx={5}
          fill="var(--color-text-primary)"
          opacity={0.92}
        />
        <text
          x={x}
          y={ty + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fontWeight="600"
          fill="#fff"
        >
          {label}
        </text>
        <polygon
          points={
            upper
              ? `${x - 4},${ty + 10} ${x + 4},${ty + 10} ${x},${ty + 15}`
              : `${x - 4},${ty - 10} ${x + 4},${ty - 10} ${x},${ty - 15}`
          }
          fill="var(--color-text-primary)"
          opacity={0.92}
        />
      </g>
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', padding: '2px 4px' }}>
      <svg
        viewBox="-15 -5 350 290"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-label="치아맵 - 상악과 하악"
      >
        {/* ── Gum backgrounds ── */}
        <path d={buildGumPath(true)} fill="#F8D6D0" opacity={0.28} />
        <path d={buildGumPath(false)} fill="#F8D6D0" opacity={0.28} />

        {/* ── Jaw labels ── */}
        <text x="160" y="16" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-text-secondary)">
          상악 (위턱)
        </text>
        <text x="160" y="258" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-text-secondary)">
          하악 (아래턱)
        </text>

        {/* ── Vertical midline ── */}
        <line
          x1="160" y1="148" x2="160" y2="162"
          stroke="var(--color-border)" strokeWidth={0.5} strokeDasharray="3,3"
        />

        {/* ── Side indicators ── */}
        <text x="14" y="155" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-text-tertiary)">R</text>
        <text x="306" y="155" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-text-tertiary)">L</text>

        {/* ── Region labels in the gap ── */}
        <text x="160" y="156" textAnchor="middle" fontSize="8" fill="var(--color-text-tertiary)">앞니</text>
        <text x="113" y="151" textAnchor="middle" fontSize="7" fill="var(--color-text-tertiary)">송곳니</text>
        <text x="207" y="151" textAnchor="middle" fontSize="7" fill="var(--color-text-tertiary)">송곳니</text>
        <text x="82" y="156" textAnchor="middle" fontSize="7" fill="var(--color-text-tertiary)">소구치</text>
        <text x="238" y="156" textAnchor="middle" fontSize="7" fill="var(--color-text-tertiary)">소구치</text>
        <text x="48" y="151" textAnchor="middle" fontSize="7.5" fill="var(--color-text-tertiary)">어금니</text>
        <text x="272" y="151" textAnchor="middle" fontSize="7.5" fill="var(--color-text-tertiary)">어금니</text>

        {/* ── Tooth number labels ── */}
        {renderNumberLabels(UPPER_TEETH, true)}
        {renderNumberLabels(LOWER_TEETH, false)}

        {/* ── Upper teeth ── */}
        {UPPER_TEETH.map((t, i) => renderTooth(t, i, true))}

        {/* ── Lower teeth ── */}
        {LOWER_TEETH.map((t, i) => renderTooth(t, i, false))}

        {/* ── Tooltip ── */}
        {renderTooltip()}
      </svg>
    </div>
  );
}
