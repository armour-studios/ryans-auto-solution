import fs from 'fs';
import path from 'path';

export type User = {
    username: string;
    password: string;
    role: 'admin' | 'user';
    createdAt: string;
};

const dataFilePath = path.join(process.cwd(), 'data/users.json');

export function getUsers(): User[] {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error reading users data:", error);
        return [];
    }
}

export function saveUsers(users: User[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
}

export function getUserByUsername(username: string): User | undefined {
    const users = getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

export function addUser(user: User): boolean {
    const users = getUsers();
    // Check if username already exists
    if (users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
        return false;
    }
    users.push(user);
    saveUsers(users);
    return true;
}

export function deleteUser(username: string): boolean {
    const users = getUsers();
    const filteredUsers = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
    if (filteredUsers.length === users.length) {
        return false; // User not found
    }
    saveUsers(filteredUsers);
    return true;
}

export function updateUser(username: string, updates: Partial<User>): boolean {
    const users = getUsers();
    const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (index === -1) {
        return false;
    }
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return true;
}
