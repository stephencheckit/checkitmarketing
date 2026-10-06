export function sparklinePath(values: number[], width: number, height: number, min?: number, max?: number) {
  const lo = min ?? Math.min(...values);
  const hi = max ?? Math.max(...values);
  const range = hi - lo || 1;
  const step = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - lo) / range) * height;
    return [x, y] as const;
  });
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const last = points[points.length - 1];
  return { line, area, last };
}

export function valueToY(value: number, height: number, min: number, max: number) {
  return height - ((value - min) / (max - min)) * height;
}
