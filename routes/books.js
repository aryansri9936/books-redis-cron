import express from "express";
import { getBooksByUser, addBook, updateBook, deleteBook } from "../models/books.js";
import { createClient } from "redis";
const router = express.Router();
const redis = createClient({ url: process.env.REDIS_URL }); await redis.connect();

function cacheKey(userId) { return `books:${userId}`; }
function bulkKey(userId) { return `bulk:${userId}`; }

// GET /books
router.get("/", async (req, res) => {
    const key = cacheKey(req.user.id), cached = await redis.get(key);
    if (cached) return res.json({ source: "cache", data: JSON.parse(cached) });
    const data = getBooksByUser(req.user.id);
    await redis.set(key, JSON.stringify(data), { EX: 60 });
    res.json({ source: "db", data });
});

// POST /books
router.post("/", async (req, res) => {
    const book = addBook(req.user.id, req.body);
    await redis.del(cacheKey(req.user.id));
    res.json(book);
});

// PUT /books/:id
router.put("/:id", async (req, res) => {
    const book = updateBook(req.user.id, req.params.id, req.body);
    if (!book) return res.status(404).json({ error: "Book not found" });
    await redis.del(cacheKey(req.user.id));
    res.json(book);
});

// DELETE /books/:id
router.delete("/:id", async (req, res) => {
    const book = deleteBook(req.user.id, req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    await redis.del(cacheKey(req.user.id));
    res.json({ message: "Book deleted", book });
});

// POST /books/bulk
router.post("/bulk", async (req, res) => {
    await redis.set(bulkKey(req.user.id), JSON.stringify(req.body.books));
    res.json({ message: "Books will be added later." });
});

export default router;
