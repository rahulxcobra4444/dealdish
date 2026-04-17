const RateLimitLog = require('../models/RateLimitLog');

// Logs repeated hits from the same IP to the database
const rateLimitLogger = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const endpoint = req.originalUrl;

    const existing = await RateLimitLog.findOne({ ip, endpoint });

    if (existing) {
      existing.hitCount += 1;
      existing.lastHit = new Date();
      // Auto-ban if hit count exceeds 500 in the log
      if (existing.hitCount > 500) {
        existing.isBanned = true;
      }
      await existing.save();
    } else {
      await RateLimitLog.create({ ip, endpoint });
    }
  } catch (err) {
    // Non-blocking — log errors silently, never crash the request
    console.error('RateLimitLog error:', err.message);
  }

  next();
};

// Blocks IPs that have been flagged as banned
const blockBannedIPs = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const log = await RateLimitLog.findOne({ ip, isBanned: true });
    if (log) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
  } catch (err) {
    console.error('BlockBannedIP error:', err.message);
  }
  next();
};

module.exports = { rateLimitLogger, blockBannedIPs };
