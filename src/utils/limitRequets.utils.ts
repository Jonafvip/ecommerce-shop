import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => {
    if (req.user) return 1000;
    return 100;
  },
  keyGenerator: (req) => {
    if (req.user?.id) return req.user.id.toString();
    return req.ip || "anonymous";
  },
});

export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, //ventanas de 15 min
  delayAfter: 50,
  delayMs: (used) => {
    return (used - 50) * 500;
  },
  maxDelayMs: 2000,
});
