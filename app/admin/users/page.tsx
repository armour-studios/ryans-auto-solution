'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type User = {
    username: string;
    role: 'admin' | 'editor';
    createdAt: string;
};

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'editor'>('editor');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(`User "${newUsername}" created as ${newRole}!`);
                setNewUsername('');
                setNewPassword('');
                setNewRole('editor');
                setShowForm(false);
                fetchUsers();
            } else {
                setError(data.error || 'Failed to create user');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    const handleDeleteUser = async (username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(`User "${username}" deleted successfully`);
                fetchUsers();
            } else {
                setError(data.error || 'Failed to delete user');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)', textTransform: 'uppercase', margin: 0 }}>User Management</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary"
                    >
                        {showForm ? 'Cancel' : '+ Add User'}
                    </button>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        marginBottom: '1.5rem'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#10b981',
                        marginBottom: '1.5rem'
                    }}>
                        {success}
                    </div>
                )}

                {/* Add User Form */}
                {showForm && (
                    <form onSubmit={handleCreateUser} style={{
                        backgroundColor: '#111',
                        padding: '2rem',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', color: '#fff' }}>Create New User</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Username</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder="Enter username"
                                    required
                                    minLength={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '6px',
                                        border: '1px solid #333',
                                        backgroundColor: '#222',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                    minLength={6}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '6px',
                                        border: '1px solid #333',
                                        backgroundColor: '#222',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Role</label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'editor')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '6px',
                                        border: '1px solid #333',
                                        backgroundColor: '#222',
                                        color: '#fff'
                                    }}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button type="submit" className="btn btn-accent" style={{ padding: '0.75rem 2rem' }}>
                                Create User
                            </button>
                            <span style={{ fontSize: '0.85rem', color: '#666' }}>
                                Editors can manage content but cannot access user management.
                            </span>
                        </div>
                    </form>
                )}

                {/* Users List */}
                <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        padding: '1rem 1.5rem',
                        backgroundColor: '#0a0a0a',
                        fontWeight: 'bold',
                        color: '#888',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        letterSpacing: '1px'
                    }}>
                        <span>Username</span>
                        <span>Role</span>
                        <span>Created</span>
                        <span>Actions</span>
                    </div>

                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading...</div>
                    ) : users.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No users found</div>
                    ) : (
                        users.map((user) => (
                            <div key={user.username} style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                                padding: '1rem 1.5rem',
                                borderTop: '1px solid #222',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: '#fff', fontWeight: 'bold' }}>{user.username}</span>
                                <span>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: user.role === 'admin' ? 'rgba(0,123,255,0.2)' : 'rgba(16,185,129,0.2)',
                                        color: user.role === 'admin' ? 'var(--primary-color)' : '#10b981',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        textTransform: 'capitalize'
                                    }}>
                                        {user.role}
                                    </span>
                                </span>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>{user.createdAt}</span>
                                <span>
                                    <button
                                        onClick={() => handleDeleteUser(user.username)}
                                        style={{
                                            padding: '0.4rem 1rem',
                                            backgroundColor: 'transparent',
                                            border: '1px solid #ef4444',
                                            color: '#ef4444',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </span>
                            </div>
                        ))
                    )}
                </div>

                <p style={{ marginTop: '1.5rem', color: '#555', fontSize: '0.85rem' }}>
                    <strong>Admin:</strong> Full access to all features including user management.<br />
                    <strong>Editor:</strong> Can manage inventory, blog, and testimonials only.
                </p>
            </div>
        </div>
    );
}
