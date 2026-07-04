import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.SESSION_SECRET || "fallback-secret-change-me";
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.token;
    if (!token) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
export function requireAdmin(req, res, next) {
    requireAuth(req, res, () => {
        if (req.user?.role !== "admin") {
            res.status(403).json({ error: "Admin access required" });
            return;
        }
        next();
    });
}
export function signToken(payload, options = {}) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d", ...options });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
