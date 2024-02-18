import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 30,
    message: "The limit of entries in the same time period was exceeded"
})