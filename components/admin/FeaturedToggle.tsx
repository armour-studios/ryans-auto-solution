'use client';

import { useState } from 'react';

interface FeaturedToggleProps {
    id: number;
    initialStatus: boolean;
}

export default function FeaturedToggle({ id, initialStatus }: FeaturedToggleProps) {
    const [isFeatured, setIsFeatured] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsFeatured(newValue);
        setLoading(true);

        try {
            const response = await fetch(`/api/inventory/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trending: newValue }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating featured status:', error);
            // Revert on failure
            setIsFeatured(!newValue);
            alert('Failed to update featured status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '22px',
                height: '22px',
                cursor: loading ? 'not-allowed' : 'pointer',
            }}>
                <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={handleToggle}
                    disabled={loading}
                    style={{
                        opacity: 0,
                        width: 0,
                        height: 0,
                        position: 'absolute'
                    }}
                />
                <span style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: isFeatured ? 'var(--primary-color)' : 'transparent',
                    border: isFeatured ? '2px solid var(--primary-color)' : '2px solid #444',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {isFeatured && (
                        <svg
                            viewBox="0 0 24 24"
                            style={{
                                width: '14px',
                                height: '14px',
                                fill: 'none',
                                stroke: 'white',
                                strokeWidth: '4px',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round'
                            }}
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}
                </span>
            </label>
        </div>
    );
}
