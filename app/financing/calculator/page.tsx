'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PaymentCalculatorPage() {
    const [vehiclePrice, setVehiclePrice] = useState(25000);
    const [downPayment, setDownPayment] = useState(3000);
    const [tradeInValue, setTradeInValue] = useState(0);
    const [interestRate, setInterestRate] = useState(7.5);
    const [loanTerm, setLoanTerm] = useState(60);
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        calculatePayment();
    }, [vehiclePrice, downPayment, tradeInValue, interestRate, loanTerm]);

    const calculatePayment = () => {
        const principal = vehiclePrice - downPayment - tradeInValue;
        if (principal <= 0) {
            setMonthlyPayment(0);
            setTotalInterest(0);
            setTotalCost(0);
            return;
        }

        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTerm;

        if (monthlyRate === 0) {
            setMonthlyPayment(principal / numPayments);
            setTotalInterest(0);
            setTotalCost(principal);
        } else {
            const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
            const total = payment * numPayments;
            const interest = total - principal;

            setMonthlyPayment(payment);
            setTotalInterest(interest);
            setTotalCost(total);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div style={{ padding: '4rem 0', color: '#fff', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Link href="/financing" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        ← Back to Financing
                    </Link>
                    <h1 style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>
                        Payment Calculator
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', margin: '0 auto' }}>
                        Estimate your monthly car payment. Adjust the values below to see how different scenarios affect your payment.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'start' }}>
                    {/* Calculator Inputs */}
                    <div style={{ backgroundColor: '#111', padding: '2.5rem', borderRadius: '12px', border: '1px solid #333' }}>
                        <h2 style={{ fontSize: '1.3rem', marginBottom: '2rem', color: 'var(--primary-color)' }}>Enter Your Details</h2>

                        {/* Vehicle Price */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <label style={{ fontWeight: 'bold' }}>Vehicle Price</label>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCurrency(vehiclePrice)}</span>
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="75000"
                                step="500"
                                value={vehiclePrice}
                                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                                <span>$5,000</span>
                                <span>$75,000</span>
                            </div>
                        </div>

                        {/* Down Payment */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <label style={{ fontWeight: 'bold' }}>Down Payment</label>
                                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCurrency(downPayment)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="20000"
                                step="250"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#10b981' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                                <span>$0</span>
                                <span>$20,000</span>
                            </div>
                        </div>

                        {/* Trade-In Value */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <label style={{ fontWeight: 'bold' }}>Trade-In Value</label>
                                <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCurrency(tradeInValue)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="30000"
                                step="500"
                                value={tradeInValue}
                                onChange={(e) => setTradeInValue(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#f59e0b' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                                <span>$0</span>
                                <span>$30,000</span>
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <label style={{ fontWeight: 'bold' }}>Interest Rate (APR)</label>
                                <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>{interestRate.toFixed(1)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="25"
                                step="0.5"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#ef4444' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                                <span>0%</span>
                                <span>25%</span>
                            </div>
                        </div>

                        {/* Loan Term */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>Loan Term</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                                {[36, 48, 60, 72].map(term => (
                                    <button
                                        key={term}
                                        onClick={() => setLoanTerm(term)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            border: loanTerm === term ? '2px solid var(--primary-color)' : '1px solid #444',
                                            backgroundColor: loanTerm === term ? 'rgba(0,123,255,0.2)' : '#222',
                                            color: loanTerm === term ? 'var(--primary-color)' : '#fff',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {term} mo
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div>
                        {/* Monthly Payment Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary-color) 0%, #0056b3 100%)',
                            padding: '2.5rem',
                            borderRadius: '16px',
                            textAlign: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <p style={{ textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>Estimated Monthly Payment</p>
                            <div style={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: 1 }}>
                                {formatCurrency(monthlyPayment)}
                            </div>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>per month for {loanTerm} months</p>
                        </div>

                        {/* Breakdown */}
                        <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Loan Breakdown</h3>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
                                <span style={{ color: '#888' }}>Vehicle Price</span>
                                <span style={{ fontWeight: 'bold' }}>{formatCurrency(vehiclePrice)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
                                <span style={{ color: '#888' }}>Down Payment</span>
                                <span style={{ fontWeight: 'bold', color: '#10b981' }}>- {formatCurrency(downPayment)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
                                <span style={{ color: '#888' }}>Trade-In Value</span>
                                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>- {formatCurrency(tradeInValue)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
                                <span style={{ color: '#888' }}>Amount Financed</span>
                                <span style={{ fontWeight: 'bold' }}>{formatCurrency(vehiclePrice - downPayment - tradeInValue)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
                                <span style={{ color: '#888' }}>Total Interest</span>
                                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>+ {formatCurrency(totalInterest)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                                <span style={{ fontWeight: 'bold' }}>Total Cost</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{formatCurrency(totalCost + downPayment + tradeInValue)}</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <Link href="/financing/apply" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', padding: '1rem' }}>
                                Apply Now
                            </Link>
                            <Link href="/inventory" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', padding: '1rem' }}>
                                Browse Inventory
                            </Link>
                        </div>

                        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                            * Estimates for informational purposes only. Actual rates and terms may vary based on credit approval.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
