import bcrypt from "bcrypt";
import { users } from "../db.js";

export function createUser(username, password) {
    const hash = bcrypt.hashSync(password, 10);
    const user = { id: users.length + 1, username, password: hash };
    users.push(user);
    return user;
}
export function findUser(username) {
    return users.find(u => u.username === username);
}
export function validatePassword(user, pass) {
    return bcrypt.compareSync(pass, user.password);
}
