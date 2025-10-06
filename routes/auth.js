import express from "express";
import jwt from "jsonwebtoken";
import { createUser, findUser, validatePassword } from "../models/users.js";
const router = express.Router();

router.post("/signup", (req, res) => {
    const { username, password } = req.body;
    if (findUser(username)) return res.status(400).json({ error: "Username exists" });
    const user = createUser(username, password);
    res.json({ message: "Signup success", user: { id: user.id, username: user.username } });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = findUser(username);
    if (!user || !validatePassword(user, password))
        return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

export default router;
