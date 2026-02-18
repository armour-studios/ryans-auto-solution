"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '4rem 0',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                backgroundColor: '#111',
                padding: '3rem',
                borderRadius: '16px',
                border: '1px solid #333',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h1 style={{
                        textTransform: 'uppercase',
                        color: '#fff',
                        marginBottom: '1.5rem',
                        fontWeight: 'bold',
                        letterSpacing: '2px'
                    }}>Admin Access</h1>
                    <p style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Authorized Entry Only</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#aaa',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                backgroundColor: '#222',
                                color: '#fff',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#aaa',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                backgroundColor: '#222',
                                color: '#fff',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#ef4444',
                            marginBottom: '1.5rem',
                            textAlign: 'center',
                            padding: '0.75rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            backgroundColor: 'var(--primary-color)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#555'
                }}>
                    Authorized personnel only
                </p>
            </div>
        </div>
    );
}
