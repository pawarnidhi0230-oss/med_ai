import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function UserDetails() {
  const { t, navigate, setUserData, addNotification } = useContext(AppContext);
  const [form, setForm] = useState({ name: '', age: '', gender: 'Female', occupation: '' });

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleNext = () => {
    if (!form.name || !form.age) { addNotification('Please fill in all required fields', 'warning'); return; }
    setUserData(form);
    navigate('pregnancyDetails');
  };

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('permissions')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: '#FFB6C1', fontWeight: 600, fontFamily: 'Outfit' }}>Personal Details</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,2,3,4].map(i => <div key={i} className={`step-dot ${i === 1 ? 'active' : ''}`} />)}
        </div>
      </div>

      <div className="page-content">
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>👤</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: '#FFB6C1' }}>Tell us about yourself</h2>
            <p style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.9rem', marginTop: 6 }}>Your information helps us personalise your care</p>
          </div>

          <div className="premium-card" style={{ padding: '28px 24px' }}>
            <div className="form-group">
              <label className="form-label">👤 {t.name} *</label>
              <input className="form-input" placeholder="Enter your full name" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">🎂 {t.age} *</label>
                <input className="form-input" type="number" placeholder="Age in years" min="15" max="55" value={form.age} onChange={e => update('age', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">⚧ {t.gender}</label>
                <select className="form-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">💼 {t.occupation}</label>
              <input className="form-input" placeholder="e.g. Teacher, Homemaker, Engineer..." value={form.occupation} onChange={e => update('occupation', e.target.value)} />
            </div>

            <div className="divider" />

            {/* Health Tips Preview */}
            <div style={{ background: 'rgba(214,51,108,0.08)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(214,51,108,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span>💡</span>
                <span style={{ color: '#FFB6C1', fontSize: '0.85rem', fontWeight: 600 }}>Did you know?</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Anemia affects 50% of pregnant women in India. NutriShield helps you detect and prevent it early through diet tracking and symptom analysis.
              </p>
            </div>
          </div>

          <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', marginTop: 24, padding: '16px', fontSize: '1rem' }}>
            {t.next} →
          </button>
        </div>
      </div>
    </div>
  );
}
