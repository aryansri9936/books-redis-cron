import { createClient } from "redis";
import { addBooksBulk } from "./models/books.js";
import { users } from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

function bulkKey(userId) { return `bulk:${userId}`; }

setInterval(async () => {
    for (const user of users) {
        const key = bulkKey(user.id);
        const raw = await redis.get(key);
        if (raw) {
            const arr = JSON.parse(raw);
            addBooksBulk(user.id, arr);  // Add to DB
            await redis.del(key);
            console.log(`Bulk insert for user ${user.username} complete.`);
        }
    }
}, 2 * 60 * 1000); // every 2 mins

console.log("Bulk books cron job running. Ctrl+C to stop.");
