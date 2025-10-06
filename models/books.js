import { books } from "../db.js";
import { v4 as uuid } from "uuid";

export function getBooksByUser(userId) { return books.filter(b => b.userId === userId); }
export function addBook(userId, data) {
    const book = { ...data, id: uuid(), userId };
    books.push(book); return book;
}
export function updateBook(userId, id, data) {
    const idx = books.findIndex(b => b.userId === userId && b.id === id);
    if (idx === -1) return null;
    books[idx] = { ...books[idx], ...data };
    return books[idx];
}
export function deleteBook(userId, id) {
    const idx = books.findIndex(b => b.userId === userId && b.id === id);
    if (idx === -1) return null;
    return books.splice(idx, 1)[0];
}
export function addBooksBulk(userId, arr) {
    return arr.map(book => addBook(userId, book));
}
