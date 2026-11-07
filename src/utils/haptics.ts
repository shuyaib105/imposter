/** Short vibration that mimics a native tap. No-op where unsupported (iOS). */
export function hapticTap(duration = 8) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  } catch {}
}
