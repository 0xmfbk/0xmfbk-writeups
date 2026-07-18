import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

export const AMMAN_TZ = "Asia/Amman";

/** Convert a "YYYY-MM-DDTHH:mm" local (Amman) string to UTC ISO for storage. */
export function ammanLocalToUtcISO(local: string): string {
  if (!local) return "";
  return fromZonedTime(local, AMMAN_TZ).toISOString();
}

/** Convert a UTC ISO string to the "YYYY-MM-DDTHH:mm" value expected by <input type="datetime-local">. */
export function utcISOToAmmanLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = toZonedTime(new Date(iso), AMMAN_TZ);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Human-readable Amman timestamp. */
export function formatAmman(iso: string | null | undefined, pattern = "yyyy-MM-dd HH:mm zzz"): string {
  if (!iso) return "—";
  return formatInTimeZone(new Date(iso), AMMAN_TZ, pattern);
}
