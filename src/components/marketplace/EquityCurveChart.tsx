export function EquityCurveChart({ equityCurve }: { equityCurve: number[] }) {
  if (equityCurve.length < 2) return null;

  const width = 600;
  const height = 160;
  const min = Math.min(...equityCurve);
  const max = Math.max(...equityCurve);
  const range = max - min || 1;

  const points = equityCurve
    .map((value, i) => {
      const x = (i / (equityCurve.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const isUp = equityCurve[equityCurve.length - 1] >= equityCurve[0];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? "var(--color-gain)" : "var(--color-loss)"}
        strokeWidth="2"
      />
    </svg>
  );
}
