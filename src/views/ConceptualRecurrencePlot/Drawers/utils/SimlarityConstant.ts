export const groupRanges: Record<string, { row: [number, number]; col: [number, number] }> = {
  g1: { row: [0, 18], col: [0, 19] },
  g2: { row: [14, 37], col: [15, 38] },
  g3: { row: [23, 58], col: [24, 59] },
  g4: { row: [42, 79], col: [43, 80] },
  g5: { row: [72, 106], col: [73, 107] },
  g6: { row: [93, 126], col: [94, 127] },
  g7: { row: [145, 183], col: [146, 184] },
};

export const finalColors = [
  '#200611', '#280909', '#400000', '#4a0101', '#540402', '#5d0904',
  '#661005', '#6e1807', '#762008', '#7d2809', '#84300a', '#8b380a',
  '#91410b', '#974a0d', '#9c520e', '#a15b10', '#a66412', '#aa6d15',
  '#ae7619', '#b77d22', '#bf842c', '#c68c37', '#cd9343', '#d49b4f',
  '#dba35b', '#e1ab68', '#e7b376', '#ecbb84', '#f1c493', '#f5cca3',
  '#f9d5b3', '#fcdec3'
];

export const participantMap: Record<string, string> = {
  이준석: 'LJS',
  박휘락: 'PHR',
  장경태: 'JKT',
  김종대: 'KJD',
};

export const adjustedOpacityValues = [
  18.82751331, 6.981868806, 3.869509114, 2.468925094, 1.903323926, 1.542776171,
  1.213284972, 1.088114596, 0.942875687, 0.828912509, 0.706295081, 0.63287685,
  0.591230262, 0.538005371, 0.463493915, 0.427013104, 0.384948635, 0.34470879,
  0.319079873, 0.292835439, 0.270182682, 0.258855898, 0.250068499, 0.232544626,
  0.219586255, 0.202812561, 0.190284102, 0.174569335, 0.16811274, 0.15309027,
  0.145516623, 0.136490058, 0.129594874, 0.123529022, 0.111817947, 0.107986048,
  0.101794567, 0.093841692, 0.089619484, 0.087219676, 0.085178754, 0.078508682,
  0.071999629, 0.070674205, 0.066783795, 0.058822291, 0.042814651, 0.038027543,
  0.035979082, 0.025598677, 0.021260026, 0.016818621, 0.01293302, 0.005213995,
]; // All refutation slice for 54 counts

export function getGroupKeys(rowIdx: number, colIdx: number): string[] {
  return Object.entries(groupRanges)
    .filter(([_, range]) =>
      rowIdx >= range.row[0] && rowIdx <= range.row[1] &&
      colIdx >= range.col[0] && colIdx <= range.col[1]
    )
    .map(([key]) => key);
}

export function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
