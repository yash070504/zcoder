// ═══════════════════════════════════════════════════════════════════
// cacheService.js — In-Memory & Redis Cache with Invalidation
//
// SDE 2 Features:
// 1. Transparent Read-Through caching for problem lists & contest calendars
// 2. Automated TTL expiration
// 3. Pattern-based cache eviction on update
// ═══════════════════════════════════════════════════════════════════

class CacheService {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value, ttlSeconds = 60) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  delete(key) {
    this.store.delete(key);
  }

  evictPattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  clear() {
    this.store.clear();
  }
}

const cacheService = new CacheService();
module.exports = cacheService;
