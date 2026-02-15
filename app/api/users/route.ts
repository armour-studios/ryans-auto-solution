import { NextResponse } from 'next/server';
import { getUsers, addUser, deleteUser, type User } from '@/lib/users';

// GET - List all users
export async function GET() {
    const users = await getUsers();
    // Passwords are already excluded in lib/getUsers
    return NextResponse.json(users);
}

// POST - Create new user
export async function POST(request: Request) {
    try {
        const { username, password, role = 'editor' } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        if (username.length < 3) {
            return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const newUser = {
            username: username.toLowerCase(),
            password,
            role,
            createdAt: new Date().toISOString()
        };

        const success = await addUser(newUser);

        if (!success) {
            return NextResponse.json({ error: 'Username already exists or database error' }, { status: 409 });
        }

        return NextResponse.json({ success: true, username: newUser.username });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

// DELETE - Remove user
export async function DELETE(request: Request) {
    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        // Prevent deleting the last admin
        const users = await getUsers();
        const admins = users.filter(u => u.role === 'admin');
        const userToDelete = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (userToDelete?.role === 'admin' && admins.length <= 1) {
            return NextResponse.json({ error: 'Cannot delete the last admin user' }, { status: 400 });
        }

        const success = await deleteUser(username);

        if (!success) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
