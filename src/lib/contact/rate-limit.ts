/** Process-local protection. Use a shared store or edge WAF when deploying multiple instances. */
export class ContactRateLimiter {
  private readonly entries = new Map<
    string,
    { count: number; expires: number }
  >();
  constructor(
    private readonly limit = 5,
    private readonly windowMs = 10 * 60 * 1000,
    private readonly maxEntries = 5000,
  ) {}
  check(
    key: string,
    now = Date.now(),
  ): { allowed: boolean; retryAfter: number } {
    for (const [entryKey, entry] of this.entries) {
      if (entry.expires <= now) this.entries.delete(entryKey);
    }
    const entry = this.entries.get(key);
    if (!entry) {
      // Reject at capacity instead of evicting active entries and allowing rate-limit bypass.
      if (this.entries.size >= this.maxEntries)
        return { allowed: false, retryAfter: Math.ceil(this.windowMs / 1000) };
      this.entries.set(key, { count: 1, expires: now + this.windowMs });
      return { allowed: true, retryAfter: 0 };
    }
    if (entry.count >= this.limit)
      return {
        allowed: false,
        retryAfter: Math.max(1, Math.ceil((entry.expires - now) / 1000)),
      };
    entry.count += 1;
    return { allowed: true, retryAfter: 0 };
  }
}
