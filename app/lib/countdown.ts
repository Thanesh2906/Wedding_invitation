export type Countdown = { days: number; hours: number; minutes: number; seconds: number; started: boolean };
export const initialCountdown: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0, started: false };
export function calculateCountdown(isoStart: string, now = Date.now()): Countdown {
  const distance = new Date(isoStart).getTime() - now;
  if (!Number.isFinite(distance) || distance <= 0) return { ...initialCountdown, started: true };
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    started: false,
  };
}
