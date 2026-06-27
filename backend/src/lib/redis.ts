import Redis from 'ioredis';

// Redis is optional — used for caching/rate limiting only
// If REDIS_URL is not set, a null stub is exported and graceful fallback is used
let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    // Don't crash the server if Redis is unavailable
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null, // stop retrying immediately
  });

  redis.on('error', (err) => {
    // Log but don't crash — Redis is optional
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Redis] Connection error (non-fatal):', err.message);
    }
  });
}

export default redis;