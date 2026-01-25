"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Confirmation Modal Component
function ConfirmModal({
    isOpen,
    onConfirm,
    onCancel,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item? This action cannot be undone."
}: {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
}) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '400px',
                width: '90%',
                border: '1px solid #333',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    gap: '0.75rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(201, 42, 55, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    </div>
                    <h3 style={{
                        margin: 0,
                        color: '#fff',
                        fontSize: '1.25rem'
                    }}>
                        {title}
                    </h3>
                </div>

                <p style={{
                    color: '#aaa',
                    marginBottom: '2rem',
                    lineHeight: '1.5'
                }}>
                    {message}
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#333',
                            color: '#fff',
                            border: '1px solid #444',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#c92a37',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DeleteButton({
    id,
    endpoint = '/api/inventory',
    itemName = 'this item'
}: {
    id: number;
    endpoint?: string;
    itemName?: string;
}) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${endpoint}/${id}`, {
                method: 'DELETE'
            });

            const json = await res.json();

            if (res.ok) {
                setShowModal(false);
                router.refresh();
            } else {
                alert(json.error || 'Failed to delete');
            }
        } catch (err) {
            alert('Error deleting');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                style={{
                    color: '#ff6b6b',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    fontWeight: 'bold',
                    transition: 'color 0.2s'
                }}
            >
                Delete
            </button>

            <ConfirmModal
                isOpen={showModal}
                onConfirm={handleDelete}
                onCancel={() => setShowModal(false)}
                title="Confirm Delete"
                message={`Are you sure you want to delete ${itemName}? This action cannot be undone.`}
            />
        </>
    );
}
