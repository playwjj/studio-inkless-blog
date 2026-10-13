/**
 * Helpers for <input type="datetime-local">, which works in the browser's
 * local time without a timezone suffix ("YYYY-MM-DDTHH:mm").
 */

const pad = (n: number) => String(n).padStart(2, '0')

/** Convert a stored ISO/UTC timestamp to a local "YYYY-MM-DDTHH:mm" input value. */
export const toDatetimeLocal = (value?: string | Date | null): string => {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Convert a local "YYYY-MM-DDTHH:mm" input value to a UTC ISO string. */
export const fromDatetimeLocal = (value?: string | null): string | undefined => {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d.toISOString()
}
