'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface SettingsData {
    site:          { businessName: string; phone: string; address: string; email: string; siteUrl: string; heroTagline: string; brandColor: string };
    facebook:      { connected: string; pageName: string; pageId: string; accessToken: string };
    instagram:     { connected: string; username: string; accountId: string; accessToken: string };
    discord:       { bugWebhookUrl: string; leadWebhookUrl: string };
    notifications: { contactFormEmail: string; financeAppEmail: string; generalAlertsEmail: string };
    google:        { connected: string; email: string; analyticsId: string; mapsApiKey: string; accessToken: string; refreshToken: string };
    smtp:          { host: string; port: string; user: string; password: string; fromName: string };
    youtube:       { connected: string; channelId: string; channelName: string; apiKey: string };
}

const DEFAULT: SettingsData = {
    site:          { businessName: '', phone: '', address: '', email: '', siteUrl: '', heroTagline: '', brandColor: '#0f71b1' },
    facebook:      { connected: 'false', pageName: '', pageId: '', accessToken: '' },
    instagram:     { connected: 'false', username: '', accountId: '', accessToken: '' },
    discord:       { bugWebhookUrl: '', leadWebhookUrl: '' },
    notifications: { contactFormEmail: '', financeAppEmail: '', generalAlertsEmail: '' },
    google:        { connected: 'false', email: '', analyticsId: '', mapsApiKey: '', accessToken: '', refreshToken: '' },
    smtp:          { host: '', port: '587', user: '', password: '', fromName: "Ryan's Auto Solution" },
    youtube:       { connected: 'false', channelId: '', channelName: '', apiKey: '' },
};

// â”€â”€ Shared styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.72rem', fontWeight: '700',
    color: '#777', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '0.45rem',
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.72rem 1rem',
    backgroundColor: '#0d0d0d', border: '1px solid #2a2a2a',
    borderRadius: '8px', color: '#f4f4f9', fontSize: '0.88rem',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
};

// â”€â”€ Field â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Field({ label, value, onChange, type = 'text', placeholder = '', hint = '' }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string; hint?: string;
}) {
    const [show, setShow] = useState(false);
    const isSecret = type === 'password';
    const isSet    = isSecret && value === '__SET__';

    return (
        <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    type={isSecret && !show ? 'password' : 'text'}
                    value={isSet ? '' : value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={isSet ? 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢  (saved â€” type to replace)' : (placeholder || label)}
                    style={{ ...inputStyle, paddingRight: isSecret ? '2.8rem' : '1rem', color: isSet ? '#555' : '#f4f4f9' }}
                    onFocus={e => (e.target.style.borderColor = '#0f71b1')}
                    onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
                />
                {isSecret && (
                    <button type="button" onClick={() => setShow(s => !s)} style={{
                        position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 0,
                    }}>
                        {show
                            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                    </button>
                )}
            </div>
            {hint && <p style={{ margin: '0.35rem 0 0', fontSize: '0.72rem', color: '#444', lineHeight: '1.4' }}>{hint}</p>}
        </div>
    );
}

// â”€â”€ ColorField â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ColorField({ label, value, onChange, hint = '' }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
    return (
        <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input type="color" value={value || '#0f71b1'} onChange={e => onChange(e.target.value)}
                    style={{ width: '48px', height: '40px', borderRadius: '8px', border: '1px solid #2a2a2a', backgroundColor: '#0d0d0d', cursor: 'pointer', padding: '2px' }}
                />
                <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="#0f71b1"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => (e.target.style.borderColor = '#0f71b1')}
                    onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
                />
            </div>
            {hint && <p style={{ margin: '0.35rem 0 0', fontSize: '0.72rem', color: '#444', lineHeight: '1.4' }}>{hint}</p>}
        </div>
    );
}

// â”€â”€ Section (manual save) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Section({ icon, title, description, onSave, saving, children }: {
    icon: React.ReactNode; title: string; description: string;
    onSave: () => void; saving: boolean; children: React.ReactNode;
}) {
    return (
        <div style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: '#0f71b1', flexShrink: 0 }}>{icon}</span>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>{title}</h2>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>{description}</p>
                    </div>
                </div>
                <button onClick={onSave} disabled={saving} style={{
                    padding: '0.5rem 1.2rem', backgroundColor: saving ? '#1a1a1a' : '#0f71b1',
                    color: saving ? '#555' : '#fff', border: 'none', borderRadius: '7px',
                    fontSize: '0.75rem', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0, transition: 'background 0.15s',
                }}>
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>
            <div style={{ padding: '1.5rem' }}>{children}</div>
        </div>
    );
}

// â”€â”€ OAuthSection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function OAuthSection({ icon, title, description, connected, connectedLabel, connectHref, onDisconnect, disconnecting, children }: {
    icon: React.ReactNode; title: string; description: string;
    connected: boolean; connectedLabel: string;
    connectHref: string; onDisconnect: () => void; disconnecting: boolean;
    children?: React.ReactNode;
}) {
    return (
        <div style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            {/* Header */}
            <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: '#0f71b1', flexShrink: 0 }}>{icon}</span>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>{title}</h2>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>{description}</p>
                    </div>
                </div>
                {connected ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(34,197,94,0.08)', padding: '0.3rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.2)', flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Connected
                    </span>
                ) : (
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: '#161616', padding: '0.3rem 0.65rem', borderRadius: '6px', border: '1px solid #2a2a2a', flexShrink: 0 }}>
                        Not Connected
                    </span>
                )}
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem' }}>
                {connected ? (
                    <>
                        {/* Connected account row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', backgroundColor: '#0d0d0d', borderRadius: '8px', border: '1px solid #1e1e1e', marginBottom: children ? '1.4rem' : 0, gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                <span style={{ color: '#22c55e' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                </span>
                                <p style={{ margin: 0, fontSize: '0.83rem', color: '#f4f4f9', fontWeight: '600' }}>{connectedLabel}</p>
                            </div>
                            <button onClick={onDisconnect} disabled={disconnecting} style={{
                                padding: '0.38rem 0.9rem', backgroundColor: 'transparent', color: '#ef4444',
                                border: '1px solid rgba(239,68,68,0.35)', borderRadius: '6px',
                                fontSize: '0.72rem', fontWeight: '700', cursor: disconnecting ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase', letterSpacing: '0.8px', flexShrink: 0,
                            }}>
                                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                            </button>
                        </div>
                        {children}
                    </>
                ) : (
                    <>
                        <a href={connectHref} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                            padding: '0.72rem 1.4rem', backgroundColor: '#0f71b1', color: '#fff',
                            borderRadius: '8px', fontSize: '0.83rem', fontWeight: '700',
                            textDecoration: 'none', marginBottom: children ? '1.2rem' : 0,
                            transition: 'background 0.15s',
                        }}>
                            {icon}
                            Connect with {title}
                        </a>
                        {children}
                    </>
                )}
            </div>
        </div>
    );
}

// â”€â”€ Icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const Icons = {
    site:         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    facebook:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    instagram:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    discord:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.012.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>,
    notifications:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    google:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/></svg>,
    smtp:         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    youtube:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
    appearance:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
};

// â”€â”€ Hint box â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SetupHint({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(15,113,177,0.06)', border: '1px solid rgba(15,113,177,0.18)', borderRadius: '8px', fontSize: '0.75rem', color: '#4a90c4', lineHeight: '1.55' }}>
            {children}
        </div>
    );
}

// â”€â”€ Inner page (uses useSearchParams) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SettingsInner() {
    const searchParams = useSearchParams();
    const [settings, setSettings] = useState<SettingsData>(DEFAULT);
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState<string | null>(null);
    const [disconnecting, setDisconnecting] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    // Show toast from OAuth redirect query params
    useEffect(() => {
        const connected = searchParams.get('connected');
        const error     = searchParams.get('error');
        if (connected === 'facebook') showToast('Facebook connected successfully!');
        else if (connected === 'google') showToast('Google connected successfully!');
        else if (error === 'facebook_denied') showToast('Facebook authorisation cancelled', false);
        else if (error === 'facebook_failed') showToast('Facebook connection failed â€” check your App ID & Secret', false);
        else if (error === 'facebook_no_app_id') showToast('FACEBOOK_APP_ID is not set in .env.local', false);
        else if (error === 'google_denied') showToast('Google authorisation cancelled', false);
        else if (error === 'google_failed') showToast('Google connection failed â€” check your Client ID & Secret', false);
        else if (error === 'google_no_client_id') showToast('GOOGLE_CLIENT_ID is not set in .env.local', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetch('/api/settings')
            .then(r => r.json())
            .then(data => {
                setSettings(prev => ({
                    site:          { ...prev.site,          ...data.site },
                    facebook:      { ...prev.facebook,      ...data.facebook },
                    instagram:     { ...prev.instagram,     ...data.instagram },
                    discord:       { ...prev.discord,       ...data.discord },
                    notifications: { ...prev.notifications, ...data.notifications },
                    google:        { ...prev.google,        ...data.google },
                    smtp:          { ...prev.smtp,          ...data.smtp },
                    youtube:       { ...prev.youtube,       ...data.youtube },
                }));
            })
            .catch(() => showToast('Could not load settings', false))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveSection = useCallback(async (section: keyof SettingsData) => {
        setSaving(section);
        try {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [section]: settings[section] }),
            });
            if (res.ok) showToast('Settings saved');
            else showToast('Failed to save settings', false);
        } catch {
            showToast('Network error', false);
        } finally {
            setSaving(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    const disconnect = useCallback(async (provider: string) => {
        setDisconnecting(provider);
        try {
            const res = await fetch('/api/auth/disconnect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider }),
            });
            if (res.ok) {
                // Refresh settings from server
                const fresh = await fetch('/api/settings').then(r => r.json());
                setSettings(prev => ({ ...prev, ...fresh }));
                showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} disconnected`);
            } else {
                showToast('Disconnect failed', false);
            }
        } catch {
            showToast('Network error', false);
        } finally {
            setDisconnecting(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const set = <K extends keyof SettingsData>(section: K, field: keyof SettingsData[K], value: string) => {
        setSettings(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    };

    const fbConnected = settings.facebook.connected === 'true';
    const igConnected = settings.instagram.connected === 'true';
    const gConnected  = settings.google.connected   === 'true';
    const ytConnected = settings.youtube.connected   === 'true';

    if (loading) {
        return (
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                <div style={{ height: '32px', backgroundColor: '#1a1a1a', borderRadius: '8px', width: '200px', marginBottom: '2rem', animation: 'pulse 1.5s infinite' }} />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', height: '160px', marginBottom: '1.5rem', animation: 'pulse 1.5s infinite' }} />
                ))}
                <style jsx global>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
                    padding: '0.85rem 1.4rem', borderRadius: '10px',
                    backgroundColor: toast.ok ? '#0f71b1' : '#ef4444',
                    color: '#fff', fontSize: '0.88rem', fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)', animation: 'fadeIn 0.2s ease',
                }}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f71b1" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', margin: 0 }}>Site Settings</h1>
                </div>
                <p style={{ color: '#555', fontSize: '0.88rem', margin: 0 }}>
                    Configure integrations, social media, and site-wide preferences. Each section saves independently.
                </p>
            </div>

            {/* â”€â”€ Site Information â”€â”€ */}
            <Section icon={Icons.site} title="Site Information" description="Business details used in metadata, footer, and contact info" onSave={() => saveSection('site')} saving={saving === 'site'}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                    <Field label="Business Name"  value={settings.site.businessName} onChange={v => set('site', 'businessName', v)} />
                    <Field label="Phone Number"   value={settings.site.phone}         onChange={v => set('site', 'phone', v)}         placeholder="+1 (555) 000-0000" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                    <Field label="Business Address" value={settings.site.address} onChange={v => set('site', 'address', v)} placeholder="123 Main St, City, State" />
                    <Field label="Public Contact Email" value={settings.site.email} onChange={v => set('site', 'email', v)} placeholder="contact@example.com" hint="Shown in the footer and contact page." />
                </div>
                <Field label="Site URL"         value={settings.site.siteUrl}   onChange={v => set('site', 'siteUrl', v)}   placeholder="https://ryansautosolution.com" />
                <Field label="Hero Tagline"     value={settings.site.heroTagline} onChange={v => set('site', 'heroTagline', v)} placeholder="Your trusted local dealership..." hint="Displayed on the homepage hero section." />
            </Section>

            {/* â”€â”€ Appearance â”€â”€ */}
            <Section icon={Icons.appearance} title="Appearance" description="Brand colour and visual identity settings" onSave={() => saveSection('site')} saving={saving === 'site'}>
                <ColorField label="Brand Colour" value={settings.site.brandColor} onChange={v => set('site', 'brandColor', v)} hint="Primary accent colour used across buttons, links, and highlights." />
            </Section>

            {/* â”€â”€ Facebook (OAuth) â”€â”€ */}
            <OAuthSection
                icon={Icons.facebook}
                title="Facebook"
                description="Auto-post new vehicles and articles to your Facebook Page"
                connected={fbConnected}
                connectedLabel={settings.facebook.pageName ? `Page: ${settings.facebook.pageName}` : 'Facebook Page connected'}
                connectHref="/api/auth/facebook"
                onDisconnect={() => disconnect('facebook')}
                disconnecting={disconnecting === 'facebook'}
            >

            </OAuthSection>

            {/* â”€â”€ Instagram (auto via Facebook) â”€â”€ */}
            <div style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ color: '#0f71b1', flexShrink: 0 }}>{Icons.instagram}</span>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>Instagram</h2>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>Connected automatically when you link your Instagram Business Account to your Facebook Page</p>
                        </div>
                    </div>
                    {igConnected ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(34,197,94,0.08)', padding: '0.3rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.2)', flexShrink: 0 }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Connected
                        </span>
                    ) : (
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: '#161616', padding: '0.3rem 0.65rem', borderRadius: '6px', border: '1px solid #2a2a2a', flexShrink: 0 }}>
                            {fbConnected ? 'No IG Account Found' : 'Requires Facebook'}
                        </span>
                    )}
                </div>
                {igConnected && (
                    <div style={{ padding: '0 1.5rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.75rem 1rem', backgroundColor: '#0d0d0d', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
                            <span style={{ color: '#22c55e' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </span>
                            <p style={{ margin: 0, fontSize: '0.83rem', color: '#f4f4f9', fontWeight: '600' }}>
                                {settings.instagram.username ? `@${settings.instagram.username}` : `Account ID: ${settings.instagram.accountId}`}
                            </p>
                        </div>
                    </div>
                )}
                {!igConnected && fbConnected && (
                    <div style={{ padding: '0 1.5rem 1.2rem' }}>
                        <SetupHint>
                            No Instagram Business Account was found linked to your Facebook Page. In Facebook Business Settings, link your Instagram account to your Page, then reconnect Facebook above.
                        </SetupHint>
                    </div>
                )}
            </div>

            {/* â”€â”€ Google + YouTube (OAuth) â”€â”€ */}
            <OAuthSection
                icon={Icons.google}
                title="Google"
                description="Analytics reporting and YouTube channel integration via Google OAuth"
                connected={gConnected}
                connectedLabel={settings.google.email ? `Signed in as ${settings.google.email}` : 'Google account connected'}
                connectHref="/api/auth/google"
                onDisconnect={() => disconnect('google')}
                disconnecting={disconnecting === 'google'}
            >
                {/* Analytics ID + Maps key always editable */}
                <div style={{ marginTop: gConnected ? '0' : '1.2rem' }}>
                    <Field label="Analytics Measurement ID" value={settings.google.analyticsId} onChange={v => set('google', 'analyticsId', v)} placeholder="G-XXXXXXXXXX" hint="Found in Google Analytics â†’ Admin â†’ Data Streams." />
                    <Field label="Google Maps API Key" value={settings.google.mapsApiKey} onChange={v => set('google', 'mapsApiKey', v)} type="password" hint="Enable Maps JavaScript API and restrict to your domain at console.cloud.google.com." />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={() => saveSection('google')} disabled={saving === 'google'} style={{
                            padding: '0.5rem 1.2rem', backgroundColor: saving === 'google' ? '#1a1a1a' : '#0f71b1',
                            color: saving === 'google' ? '#555' : '#fff', border: 'none', borderRadius: '7px',
                            fontSize: '0.75rem', fontWeight: '700', cursor: saving === 'google' ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase', letterSpacing: '1px',
                        }}>
                            {saving === 'google' ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

            </OAuthSection>

            {/* â”€â”€ YouTube (status from Google OAuth) â”€â”€ */}
            <div style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ color: '#0f71b1', flexShrink: 0 }}>{Icons.youtube}</span>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>YouTube</h2>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>Channel detected automatically when Google is connected</p>
                        </div>
                    </div>
                    {ytConnected ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(34,197,94,0.08)', padding: '0.3rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.2)', flexShrink: 0 }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Connected
                        </span>
                    ) : (
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: '#161616', padding: '0.3rem 0.65rem', borderRadius: '6px', border: '1px solid #2a2a2a', flexShrink: 0 }}>
                            {gConnected ? 'No Channel Found' : 'Requires Google'}
                        </span>
                    )}
                </div>
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    {ytConnected && settings.youtube.channelName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.75rem 1rem', backgroundColor: '#0d0d0d', borderRadius: '8px', border: '1px solid #1e1e1e', marginBottom: '1.2rem' }}>
                            <span style={{ color: '#22c55e' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </span>
                            <p style={{ margin: 0, fontSize: '0.83rem', color: '#f4f4f9', fontWeight: '600' }}>{settings.youtube.channelName}</p>
                        </div>
                    )}
                    {/* Manual Channel ID + API Key */}
                    <Field label="Channel ID (override)" value={settings.youtube.channelId} onChange={v => set('youtube', 'channelId', v)} placeholder="UCxxxxxxxxxxxxxx" hint="Auto-filled when Google is connected. Override only if needed." />
                    <Field label="YouTube Data API Key" value={settings.youtube.apiKey} onChange={v => set('youtube', 'apiKey', v)} type="password" hint="Required for server-side YouTube API calls. Create at console.cloud.google.com." />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={() => saveSection('youtube')} disabled={saving === 'youtube'} style={{
                            padding: '0.5rem 1.2rem', backgroundColor: saving === 'youtube' ? '#1a1a1a' : '#0f71b1',
                            color: saving === 'youtube' ? '#555' : '#fff', border: 'none', borderRadius: '7px',
                            fontSize: '0.75rem', fontWeight: '700', cursor: saving === 'youtube' ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase', letterSpacing: '1px',
                        }}>
                            {saving === 'youtube' ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>

            {/* â”€â”€ Discord Webhooks â”€â”€ */}
            <Section icon={Icons.discord} title="Discord Webhooks" description="Send bug reports and new lead alerts to your Discord server" onSave={() => saveSection('discord')} saving={saving === 'discord'}>
                <Field label="Bug Reports Webhook"     value={settings.discord.bugWebhookUrl}  onChange={v => set('discord', 'bugWebhookUrl', v)}  type="password" hint="Channel: Settings â†’ Integrations â†’ Webhooks â†’ New Webhook â†’ Copy URL." />
                <Field label="New Lead Alerts Webhook" value={settings.discord.leadWebhookUrl} onChange={v => set('discord', 'leadWebhookUrl', v)} type="password" hint="Fires when a contact form or finance application is submitted." />
            </Section>

            {/* â”€â”€ Notification Emails â”€â”€ */}
            <Section icon={Icons.notifications} title="Notification Emails" description="Where form submissions and alerts are delivered" onSave={() => saveSection('notifications')} saving={saving === 'notifications'}>
                <Field label="Contact Form Recipient"      value={settings.notifications.contactFormEmail}   onChange={v => set('notifications', 'contactFormEmail', v)}   placeholder="ryan@ryansautosolution.com" hint="Receives a copy of every contact form submission." />
                <Field label="Finance Application Recipient" value={settings.notifications.financeAppEmail}  onChange={v => set('notifications', 'financeAppEmail', v)}   placeholder="finance@ryansautosolution.com" hint="Receives finance/credit application notifications." />
                <Field label="General Alerts Recipient"   value={settings.notifications.generalAlertsEmail} onChange={v => set('notifications', 'generalAlertsEmail', v)} placeholder="admin@ryansautosolution.com" hint="Receives general system alerts and ticket updates." />
            </Section>

            {/* â”€â”€ SMTP â”€â”€ */}
            <Section icon={Icons.smtp} title="Email (SMTP)" description="Outgoing mail server used for all notification emails" onSave={() => saveSection('smtp')} saving={saving === 'smtp'}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '0 1rem' }}>
                    <Field label="SMTP Host" value={settings.smtp.host} onChange={v => set('smtp', 'host', v)} placeholder="smtp.gmail.com" />
                    <Field label="Port"      value={settings.smtp.port} onChange={v => set('smtp', 'port', v)} placeholder="587" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                    <Field label="Username / Email"      value={settings.smtp.user}     onChange={v => set('smtp', 'user', v)}     placeholder="you@gmail.com" />
                    <Field label="Password / App Password" value={settings.smtp.password} onChange={v => set('smtp', 'password', v)} type="password" />
                </div>
                <Field label="From Name" value={settings.smtp.fromName} onChange={v => set('smtp', 'fromName', v)} placeholder="Ryan's Auto Solution" hint="Displayed as the sender name in notification emails." />
            </Section>

            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
                input::placeholder { color: #2e2e2e; }
                input[type="color"] { cursor: pointer; }
            `}</style>
        </div>
    );
}

// â”€â”€ Page export (wraps searchParams in Suspense) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function SettingsPage() {
    return (
        <Suspense>
            <SettingsInner />
        </Suspense>
    );
}


