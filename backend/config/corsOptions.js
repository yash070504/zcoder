const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        // Strip trailing slash if present for comparison
        const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin;
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(null, true); // In development allow flexible access or pass through
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions;