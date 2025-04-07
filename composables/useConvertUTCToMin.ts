export default function useConvertUTCToMin(utc?: string): number | undefined {
  if (!utc) {
    return undefined;
  }
  const busUTC = Date.parse(utc!);
  const s = new Date(busUTC);
  const d = new Date();
  const delta = (s.getTime() - d.getTime()) / 60000;
  if (Number.isNaN(delta)) {
    return undefined;
  }
  return Math.round(delta) >= 1 ? Math.round(delta) : 0;
}
