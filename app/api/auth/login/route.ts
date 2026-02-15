import { NextResponse } from 'next/server';
import { getUserByUsername } from '@/lib/users';

export async function POST(request: Request) {
    const { username, password } = await request.json();

    // Find matching user
    const user = await getUserByUsername(username);

    if (user && user.password === password) {
        const response = NextResponse.json({ success: true, username: user.username, role: user.role });

        // Secure httpOnly cookie for actual authentication (can't be read by JS)
        response.cookies.set('admin_session', JSON.stringify({ username: user.username, role: user.role }), {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: 'strict'
        });

        // Non-httpOnly cookie for client-side display (username/role only, no sensitive data)
        response.cookies.set('admin_user', JSON.stringify({ username: user.username, role: user.role }), {
            httpOnly: false, // Allows JavaScript to read
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: 'strict'
        });

        return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
}
