// ═══════════════════════════════════════════════════════════════════
// rateLimiter.js — Sliding Window Rate Limiting Subsystem
//
// Protects compute-heavy endpoints (/execute, /submit, /ai) from DoS/spam
// Standard headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
// ═══════════════════════════════════════════════════════════════════

function createSlidingWindowLimiter({ windowMs = 60000, maxRequests = 15, message = "Too many requests" }) {
  const requestLogs = new Map(); // IP -> array of timestamps

  // Sweep periodically to prevent memory growth
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requestLogs.entries()) {
      const valid = timestamps.filter((t) => now - t < windowMs);
      if (valid.length === 0) {
        requestLogs.delete(ip);
      } else {
        requestLogs.set(ip, valid);
      }
    }
  }, windowMs * 2);

  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown_ip";
    const now = Date.now();

    const timestamps = requestLogs.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - validTimestamps.length - 1));
    res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000));

    if (validTimestamps.length >= maxRequests) {
      return res.status(429).json({
        error: "TOO_MANY_REQUESTS",
        message,
        retryAfterSeconds: Math.ceil(windowMs / 1000)
      });
    }

    validTimestamps.push(now);
    requestLogs.set(ip, validTimestamps);
    next();
  };
}

module.exports = {
  createSlidingWindowLimiter,
  executionLimiter: createSlidingWindowLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,     // 20 runs per minute
    message: "Rate limit exceeded for code execution. Please wait a moment."
  }),
  aiLimiter: createSlidingWindowLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,     // 10 AI requests per minute
    message: "Rate limit exceeded for AI assistant. Please wait a moment."
  })
};
