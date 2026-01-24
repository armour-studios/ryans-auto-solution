"use client";

import { useState } from 'react';

export const FormSteps = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
            {/* Progress Bar background */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: '#444', zIndex: 0, transform: 'translateY(-50%)' }} />

            {/* Progress Bar active */}
            <div style={{
                position: 'absolute', top: '50%', left: 0, height: '2px', backgroundColor: 'var(--primary-color)', zIndex: 1, transform: 'translateY(-50%)',
                width: `${(currentStep / (steps.length - 1)) * 100}%`, transition: 'width 0.3s ease'
            }} />

            {steps.map((step, idx) => {
                const isActive = idx <= currentStep;
                return (
                    <div key={idx} style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                        <div style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            backgroundColor: isActive ? 'var(--primary-color)' : '#333',
                            color: isActive ? '#fff' : '#888',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 0.5rem', fontWeight: 'bold', border: '2px solid #222'
                        }}>
                            {idx + 1}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: isActive ? '#fff' : '#666', fontWeight: isActive ? 'bold' : 'normal' }}>{step}</span>
                    </div>
                );
            })}
        </div>
    );
};
