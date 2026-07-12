/**
 * Safely coerce a value to an array.
 *
 * i18next's `t(key, { returnObjects: true })` returns the **string** key when a
 * key is missing or misconfigured. Callers that immediately `.map()` the result
 * then throw and white-screen the page. Routing every `returnObjects` read
 * through this helper turns that failure into an empty render instead of a crash.
 */
export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}
