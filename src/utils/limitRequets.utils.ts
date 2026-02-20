import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import slowDown from "express-slow-down";

const isDev = process.env.NODE_ENV !== "production";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => {
    if (isDev) return 5000;
    if (req.user) return 1000;
    return 100;
  },
  keyGenerator: (req) => {
    if (req.user?.id) return req.user.id.toString();
    return ipKeyGenerator(req.ip || "anonymous");
  },
});

export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: isDev ? 1000 : 50,
  delayMs: (used) => {
    const threshold = isDev ? 1000 : 50;
    return (used - threshold) * 500;
  },
  maxDelayMs: 2000,
});
