
/**
 * Formats a high-resolution time given in seconds and nanoseconds into a human-readable string.
 *
 * The output string includes hours, minutes, seconds, milliseconds, microseconds, and nanoseconds,
 * omitting any units that are zero. For example: "1h 2m 3s 4ms 5µs 6ns".
 *
 * @param seconds - The number of whole seconds.
 * @param nanoseconds - The number of additional nanoseconds.
 * @returns A formatted string representing the total time in human-readable units.
 */
export function formatHRTime(seconds: number, nanoseconds: number): string {
  const totalNs = seconds * 1e9 + nanoseconds;

  const hours = Math.floor(totalNs / 3.6e12);
  const minutes = Math.floor((totalNs % 3.6e12) / 6e10);
  const secs = Math.floor((totalNs % 6e10) / 1e9);
  const ms = Math.floor((totalNs % 1e9) / 1e6);
  const µs = Math.floor((totalNs % 1e6) / 1e3);
  const ns = totalNs % 1e3;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (secs) parts.push(`${secs}s`);
  if (ms) parts.push(`${ms}ms`);
  if (µs) parts.push(`${µs}µs`);
  if (ns) parts.push(`${ns}ns`);

  return parts.length ? parts.join(' ') : '0ns';
}
