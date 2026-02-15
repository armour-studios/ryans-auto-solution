import { supabase } from './supabase';

export type User = {
    username: string;
    password?: string; // Optional because we don't always fetch it
    role: 'admin' | 'editor';
    createdAt: string;
};

export async function getUsers(): Promise<User[]> {
    try {
        const { data, error } = await supabase
            .from('admin_users')
            .select('username, role, created_at')
            .order('username', { ascending: true });

        if (error) {
            console.error("Error reading users from Supabase:", error);
            return [];
        }

        return (data || []).map(u => ({
            username: u.username,
            role: u.role,
            createdAt: u.created_at
        }));
    } catch (error) {
        console.error("Error calling Supabase:", error);
        return [];
    }
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

    if (error || !data) {
        return undefined;
    }

    return {
        username: data.username,
        password: data.password,
        role: data.role,
        createdAt: data.created_at
    };
}

export async function addUser(user: { username: string; password?: string; role: string; createdAt: string }): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('admin_users')
            .insert({
                username: user.username.toLowerCase(),
                password: user.password,
                role: user.role,
                created_at: user.createdAt
            });

        if (error) {
            console.error("Error adding user to Supabase:", error);
            return false;
        }
        return true;
    } catch (e) {
        console.error("Failed to add user to Supabase", e);
        return false;
    }
}

export async function deleteUser(username: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('admin_users')
            .delete()
            .eq('username', username.toLowerCase());

        if (error) {
            console.error("Error deleting user from Supabase:", error);
            return false;
        }
        return true;
    } catch (e) {
        console.error("Failed to delete user from Supabase", e);
        return false;
    }
}

export async function updateUser(username: string, updates: Partial<User & { password?: string }>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('admin_users')
            .update({
                ...(updates.role && { role: updates.role }),
                ...(updates.password && { password: updates.password }),
                ...(updates.username && { username: updates.username.toLowerCase() })
            })
            .eq('username', username.toLowerCase());

        if (error) {
            console.error("Error updating user in Supabase:", error);
            return false;
        }
        return true;
    } catch (e) {
        console.error("Failed to update user in Supabase", e);
        return false;
    }
}
