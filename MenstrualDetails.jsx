import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

function calcEDD(lmd) {
  if (!lmd) return '';
  const d = new Date(lmd);
  if (isNaN(d)) return '';
  d.setMonth(d.getMonth() + 9);
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

export default function MenstrualDetails() {
  const { t, navigate, setMenstrualData, addNotification } = useContext(AppContext);
  const [form, setForm] = useState({ flow: '', regularity: '', days: '', menarche: '', lmd: '', edd: '' });

  useEffect(() => {
    if (form.lmd) setForm(p => ({ ...p, edd: calcEDD(p.lmd) }));
  }, [form.lmd]);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleNext = () => {
    if (!form.lmd) { addNotification('Please enter Last Menstrual Date', 'warning'); return; }
    setMenstrualData(form);
    navigate('medications');
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('pregnancyDetails')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: '#FFB6C1', fontWeight: 600, fontFamily: 'Outfit' }}>Menstrual Details</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,2,3,4].map(i => <div key={i} className={`step-dot ${i <= 3 ? (i === 3 ? 'active' : 'done') : ''}`} />)}
        </div>
      </div>

      <div className="page-content">
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🗓️</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: '#FFB6C1' }}>Menstrual Cycle Details</h2>
            <p style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.9rem', marginTop: 6 }}>Helps calculate your Expected Delivery Date</p>
          </div>

          <div className="premium-card" style={{ padding: '28px 24px', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">🩸 Flow</label>
                <select className="form-select" value={form.flow} onChange={e => update('flow', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">🔄 Regularity</label>
                <select className="form-select" value={form.regularity} onChange={e => update('regularity', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">📅 Duration (Days)</label>
                <input className="form-input" type="number" min="1" max="10" placeholder="e.g. 5" value={form.days} onChange={e => update('days', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">🌸 Menarche Age</label>
                <input className="form-input" type="number" min="9" max="18" placeholder="e.g. 13" value={form.menarche} onChange={e => update('menarche', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">📆 Last Menstrual Date (approx.) *</label>
              <input className="form-input" type="date" value={form.lmd} onChange={e => update('lmd', e.target.value)} style={{ colorScheme: 'dark' }} />
            </div>

            {/* EDD Calculated */}
            {form.edd && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(214,51,108,0.15), rgba(255,64,129,0.08))',
                border: '1px solid rgba(214,51,108,0.4)',
                borderRadius: 14, padding: '18px 20px',
                animation: 'fadeInUp 0.4s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: '1.4rem' }}>🍼</span>
                  <span style={{ color: '#FFB6C1', fontWeight: 700, fontSize: '1rem', fontFamily: 'Outfit' }}>Expected Delivery Date</span>
                </div>
                <div style={{
                  fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit',
                  background: 'linear-gradient(135deg, #FFB6C1, #FF4081)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {formatDate(form.edd)}
                </div>
                <div style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.78rem', marginTop: 4 }}>
                  Calculated: LMD + 9 months + 7 days (Naegele's Rule)
                </div>
              </div>
            )}
          </div>

          <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
            {t.next} →
          </button>
        </div>
      </div>
    </div>
  );
}
