import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function PregnancyDetails() {
  const { t, navigate, setPregnancyData, addNotification } = useContext(AppContext);
  const [type, setType] = useState('');
  const [multi, setMulti] = useState({ number: '', livebirths: '', previousInfo: '', complications: '' });

  const handleNext = () => {
    if (!type) { addNotification('Please select pregnancy type', 'warning'); return; }
    setPregnancyData({ type, ...( type === 'multiple' ? multi : {}) });
    navigate('menstrualDetails');
  };

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('userDetails')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: '#FFB6C1', fontWeight: 600, fontFamily: 'Outfit' }}>{t.pregnancyType}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,2,3,4].map(i => <div key={i} className={`step-dot ${i <= 2 ? (i === 2 ? 'active' : 'done') : ''}`} />)}
        </div>
      </div>

      <div className="page-content">
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🤰</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: '#FFB6C1' }}>Pregnancy Information</h2>
            <p style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.9rem', marginTop: 6 }}>Help us understand your pregnancy journey</p>
          </div>

          {/* Pregnancy Type Selection */}
          <div className="premium-card" style={{ padding: '28px 24px', marginBottom: 20 }}>
            <label className="form-label" style={{ marginBottom: 16, display: 'block', fontSize: '1rem' }}>
              Is this your first pregnancy?
            </label>
            <div className="option-group">
              <button className={`option-btn ${type === 'first' ? 'selected' : ''}`} onClick={() => setType('first')}>
                🌸 First Pregnancy
              </button>
              <button className={`option-btn ${type === 'multiple' ? 'selected' : ''}`} onClick={() => setType('multiple')}>
                🌺 Multiple Pregnancies
              </button>
            </div>
          </div>

          {/* Multiple Pregnancy Extra Fields */}
          {type === 'multiple' && (
            <div className="premium-card" style={{ padding: '28px 24px', marginBottom: 20, animation: 'fadeInUp 0.4s ease' }}>
              <h3 style={{ color: '#FFB6C1', fontFamily: 'Outfit', fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>📋 Previous Pregnancy Details</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Number of Pregnancies</label>
                  <input className="form-input" type="number" min="2" max="20" placeholder="e.g. 2" value={multi.number} onChange={e => setMulti(p => ({ ...p, number: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Live Births</label>
                  <input className="form-input" type="number" min="0" max="20" placeholder="e.g. 1" value={multi.livebirths} onChange={e => setMulti(p => ({ ...p, livebirths: e.target.value }))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Previous Birth Info</label>
                <textarea className="form-textarea" rows={3} placeholder="Describe your previous birth experience (normal/caesarean, birth weight, etc.)" value={multi.previousInfo} onChange={e => setMulti(p => ({ ...p, previousInfo: e.target.value }))} style={{ resize: 'vertical', minHeight: 80 }} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Any Complications in Previous Pregnancy?</label>
                <textarea className="form-textarea" rows={3} placeholder="e.g. Gestational diabetes, hypertension, anaemia..." value={multi.complications} onChange={e => setMulti(p => ({ ...p, complications: e.target.value }))} style={{ resize: 'vertical', minHeight: 80 }} />
              </div>
            </div>
          )}

          {type && (
            <div style={{ background: 'rgba(74,222,128,0.08)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(74,222,128,0.2)', marginBottom: 20, animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span>💚</span>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {type === 'first'
                    ? 'First-time mothers need extra nutritional support. We\'ll guide you through each trimester with personalised diet and health tips.'
                    : 'Repeat pregnancies can deplete iron and folate stores. Your history helps us assess your specific risk profile accurately.'}
                </p>
              </div>
            </div>
          )}

          <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
            {t.next} →
          </button>
        </div>
      </div>
    </div>
  );
}
