"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FormSteps } from './FormSteps';

type VehicleFormData = {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    vin: string;
    description: string;
    features: string;
    image: string; // Main image
    images: string[];
    video?: string;
    youtubeUrl?: string;
    trending: boolean;
    status: 'Available' | 'Pending' | 'Sold';
    type: string;
    specs: {
        Engine: string;
        Transmission: string;
        Drivetrain: string;
        Fuel: string;
        Color: string;
        [key: string]: string;
    }
};

const STEPS = ['Basic Info', 'Specs & Details', 'Media', 'Description & Review'];

export default function AdminVehicleForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<VehicleFormData>(initialData ? {
        ...initialData,
        images: initialData.images || [initialData.image],
        features: Array.isArray(initialData.features) ? initialData.features.join(', ') : initialData.features || '',
        vin: initialData.vin || '',
        youtubeUrl: initialData.youtubeUrl || ''
    } : {
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        vin: '',
        description: '',
        features: '',
        image: '',
        images: [],
        video: '',
        youtubeUrl: '',
        trending: false,
        status: 'Available',
        type: '',
        specs: {
            Engine: '',
            Transmission: 'Automatic',
            Drivetrain: '4WD',
            Fuel: 'Gasoline',
            Color: ''
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name in formData.specs) {
            setFormData(prev => ({
                ...prev,
                specs: { ...prev.specs, [name]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? Number(value) : value
            }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: data });
            if (!res.ok) throw new Error('Upload failed');
            const json = await res.json();
            setFormData(prev => ({
                ...prev,
                image: prev.image ? prev.image : json.url, // Set main if empty
                images: [...prev.images, json.url]
            }));
        } catch (err) {
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = {
            ...formData,
            features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
            images: formData.images.length > 0 ? formData.images : [formData.image],
        };

        try {
            const url = initialData ? `/api/inventory/${initialData.id}` : '/api/inventory';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                router.push('/admin/inventory');
                router.refresh();
            } else {
                alert('Failed to save');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving vehicle');
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    // Preview Component
    const PreviewCard = () => (
        <div style={{ backgroundColor: '#222', color: '#fff', padding: '1.5rem', borderRadius: '8px', position: 'sticky', top: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '1rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Live Preview</h3>

            <div style={{ position: 'relative', height: '200px', backgroundColor: '#333', marginBottom: '1rem', borderRadius: '4px', overflow: 'hidden' }}>
                {formData.image ? (
                    <Image src={formData.image} alt="Preview" fill style={{ objectFit: 'cover' }} />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>No Image</div>
                )}
                {formData.status !== 'Available' && (
                    <div style={{ position: 'absolute', top: 10, right: 10, backgroundColor: formData.status === 'Sold' ? '#c92a37' : 'var(--primary-color)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                        {formData.status}
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{formData.year} {formData.make} {formData.model}</h4>
                <div style={{ color: '#bbb', fontSize: '0.9rem' }}>{formData.mileage.toLocaleString()} miles • {formData.vin || 'No VIN'}</div>
            </div>

            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                ${formData.price.toLocaleString()}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: '#ccc', marginBottom: '1rem' }}>
                <div>Engine: {formData.specs.Engine || '-'}</div>
                <div>Trans: {formData.specs.Transmission || '-'}</div>
                <div>Drive: {formData.specs.Drivetrain || '-'}</div>
                <div>Color: {formData.specs.Color || '-'}</div>
            </div>

            {(formData.youtubeUrl || formData.video) && (
                <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#333', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem' }}>
                    ▶ Video Included
                </div>
            )}
        </div>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
            <div style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '8px', color: '#fff' }}>
                <h2 style={{ marginBottom: '2rem' }}>{initialData ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                <FormSteps currentStep={currentStep} steps={STEPS} />

                {/* STEP 1: BASIC INFO */}
                {currentStep === 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div><label>VIN</label><input name="vin" value={formData.vin} onChange={handleChange} className="form-input" placeholder="17-Digit VIN" /></div>
                        <div><label>Stock # / ID</label><div style={{ padding: '0.75rem', backgroundColor: '#333', color: '#888', border: '1px solid #444', borderRadius: '4px' }}>Auto-Generated</div></div>
                        {/* ... (rest of inputs will be styled via global css update below) ... */}
                        <div><label>Make</label><input name="make" required value={formData.make} onChange={handleChange} className="form-input" /></div>
                        <div><label>Model</label><input name="model" required value={formData.model} onChange={handleChange} className="form-input" /></div>
                        <div><label>Year</label><input type="number" name="year" required value={formData.year} onChange={handleChange} className="form-input" /></div>
                        <div><label>Price</label><input type="number" name="price" required value={formData.price} onChange={handleChange} className="form-input" /></div>
                        <div><label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                                <option value="Available">Available</option>
                                <option value="Pending">Pending</option>
                                <option value="Sold">Sold</option>
                            </select>
                        </div>
                        <div><label>Trending</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <input type="checkbox" checked={formData.trending} onChange={(e) => setFormData(p => ({ ...p, trending: e.target.checked }))} />
                                <span>Feature on Homepage</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: SPECS & DETAILS */}
                {currentStep === 1 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div><label>Mileage</label><input type="number" name="mileage" required value={formData.mileage} onChange={handleChange} className="form-input" /></div>
                        <div><label>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="form-input">
                                <option value="">Select Type...</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Truck">Truck</option>
                                <option value="Coupe">Coupe</option>
                                <option value="Van">Van</option>
                            </select>
                        </div>
                        {Object.keys(formData.specs).map(key => (
                            <div key={key}>
                                <label>{key}</label>
                                <input name={key} value={formData.specs[key]} onChange={handleChange} className="form-input" />
                            </div>
                        ))}
                    </div>
                )}

                {/* STEP 3: MEDIA */}
                {currentStep === 2 && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Photos</label>
                            <input type="file" multiple onChange={handleImageUpload} accept="image/*" className="form-input" />
                            {uploading && <span>Uploading...</span>}
                            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginTop: '1rem' }}>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '100px', height: '80px', flexShrink: 0 }}>
                                        <Image src={img} alt={`img-${idx}`} fill style={{ objectFit: 'cover', borderRadius: '4px', border: idx === 0 ? '2px solid var(--primary-color)' : 'none' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Video (YouTube URL)</label>
                            <input name="youtubeUrl" value={formData.youtubeUrl || ''} onChange={handleChange} className="form-input" placeholder="https://www.youtube.com/watch?v=..." />
                        </div>

                    </div>
                )}

                {/* STEP 4: DESCRIPTION */}
                {currentStep === 3 && (
                    <div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" style={{ minHeight: '150px' }} />
                        </div>
                        <div>
                            <label>Features (Comma Separated)</label>
                            <textarea name="features" value={formData.features} onChange={handleChange} className="form-input" placeholder="Bluetooth, Heated Seats, etc." />
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                    <button type="button" onClick={prevStep} disabled={currentStep === 0} className="btn" style={{ backgroundColor: '#444', color: '#fff', visibility: currentStep === 0 ? 'hidden' : 'visible' }}>Previous</button>

                    {currentStep < STEPS.length - 1 ? (
                        <button type="button" onClick={nextStep} className="btn btn-accent">Next Step &rarr;</button>
                    ) : (
                        <button type="button" onClick={handleSubmit} className="btn btn-accent" style={{ backgroundColor: 'green' }}>Complete & Publish</button>
                    )}
                </div>
            </div>

            {/* PREVIEW SIDEBAR */}
            <PreviewCard />

            <style jsx global>{`
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #444;
                    background-color: #333;
                    color: #fff;
                    border-radius: 4px;
                    margin-top: 0.25rem;
                }
                .form-input:focus {
                    border-color: var(--primary-color);
                    outline: none;
                }
                label {
                    display: block;
                    font-weight: bold;
                    font-size: 0.9rem;
                    color: #ccc;
                }
            `}</style>
        </div>
    );
}
