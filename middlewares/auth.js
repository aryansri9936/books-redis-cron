import jwt from "jsonwebtoken";
import { findUser } from "../models/users.js";
export function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = findUser(payload.username);
        if (!user) return res.status(401).json({ error: "Invalid user" });
        req.user = user;
        next();
    } catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
