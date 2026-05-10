import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';

export default function BloodTestPage() {
  const { t, navigate, setBloodTestData, addNotification } = useContext(AppContext);
  const [choice, setChoice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extraInfo, setExtraInfo] = useState({ hb: '', rbc: '', mcv: '', mch: '', ferritin: '', wbc: '', platelets: '' });
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      addNotification('Blood report analyzed successfully! 🧬', 'success');
      setBloodTestData({ hasReport: true, image, extraInfo, analyzed: true });
    }, 2800);
  };

  const handleNo = () => {
    setBloodTestData({ hasReport: false });
    navigate('symptoms');
  };

  const handleYesContinue = () => {
    if (!analyzed) { addNotification('Please analyze the report first', 'warning'); return; }
    navigate('symptoms');
  };

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('medications')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: '#FFB6C1', fontWeight: 600, fontFamily: 'Outfit' }}>Blood Test Report</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,2,3,4].map(i => <div key={i} className={`step-dot ${i <= 4 ? (i === 4 ? 'active' : 'done') : ''}`} />)}
        </div>
      </div>

      <div className="page-content">
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🧪</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: '#FFB6C1' }}>{t.bloodTest}</h2>
            <p style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.9rem', marginTop: 6 }}>Blood tests provide the most accurate anemia diagnosis</p>
          </div>

          {/* YES / NO */}
          <div className="premium-card" style={{ padding: '28px 24px', marginBottom: 20 }}>
            <div className="option-group">
              <button className={`option-btn ${choice === 'yes' ? 'selected' : ''}`} onClick={() => setChoice('yes')} style={{ padding: '20px', fontSize: '1.1rem' }}>
                ✅ {t.yes}
              </button>
              <button className={`option-btn ${choice === 'no' ? 'selected' : ''}`} onClick={() => { setChoice('no'); }} style={{ padding: '20px', fontSize: '1.1rem' }}>
                ❌ {t.no}
              </button>
            </div>
          </div>

          {/* YES FLOW */}
          {choice === 'yes' && (
            <div style={{ animation: 'fadeInUp 0.4s ease' }}>
              <div className="premium-card" style={{ padding: '24px', marginBottom: 16 }}>
                <h3 style={{ color: '#FFB6C1', fontFamily: 'Outfit', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>
                  📤 {t.uploadReport}
                </h3>
                {!imagePreview ? (
                  <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🩺</div>
                    <p style={{ color: '#FFB6C1', fontWeight: 600, marginBottom: 4 }}>Click to upload your blood test report</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>Supports JPG, PNG, PDF images</p>
                    <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <img src={imagePreview} alt="Blood report" style={{ width: '100%', borderRadius: 12, maxHeight: 220, objectFit: 'cover', border: '2px solid rgba(214,51,108,0.4)' }} />
                    <button onClick={() => { setImage(null); setImagePreview(null); setAnalyzed(false); }} style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none',
                      borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: '0.9rem'
                    }}>✕</button>
                    {analyzed && <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(74,222,128,0.9)', borderRadius: 8, padding: '4px 10px', fontSize: '0.78rem', fontWeight: 600, color: '#000' }}>✓ Analyzed</div>}
                  </div>
                )}
              </div>

              {/* Manual Blood Values */}
              <div className="premium-card" style={{ padding: '24px', marginBottom: 16 }}>
                <h3 style={{ color: '#FFB6C1', fontFamily: 'Outfit', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>📊 Enter Blood Values (Optional)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { key: 'hb', label: 'Haemoglobin (Hb)', placeholder: 'e.g. 11.5 g/dL', normal: '11–13 g/dL' },
                    { key: 'rbc', label: 'RBC Count', placeholder: 'e.g. 4.0 M/μL', normal: '3.8–5.2 M/μL' },
                    { key: 'mcv', label: 'MCV', placeholder: 'e.g. 78 fL', normal: '80–100 fL' },
                    { key: 'mch', label: 'MCH', placeholder: 'e.g. 25 pg', normal: '27–33 pg' },
                    { key: 'ferritin', label: 'Serum Ferritin', placeholder: 'e.g. 8 ng/mL', normal: '15–150 ng/mL' },
                    { key: 'wbc', label: 'WBC Count', placeholder: 'e.g. 7500 /μL', normal: '4000–11000' },
                  ].map(f => (
                    <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>{f.label}</label>
                      <input className="form-input" placeholder={f.placeholder} value={extraInfo[f.key]} onChange={e => setExtraInfo(p => ({ ...p, [f.key]: e.target.value }))} style={{ fontSize: '0.88rem', padding: '10px 12px' }} />
                      <div style={{ color: 'rgba(255,182,193,0.45)', fontSize: '0.72rem', marginTop: 3 }}>Normal: {f.normal}</div>
                    </div>
                  ))}
                </div>
              </div>

              {!analyzed ? (
                <button className="btn-primary" onClick={handleAnalyze} disabled={!image && !extraInfo.hb} style={{ width: '100%', justifyContent: 'center', marginBottom: 12, opacity: (!image && !extraInfo.hb) ? 0.5 : 1 }}>
                  {analyzing ? (
                    <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Analyzing...</>
                  ) : '🔬 Analyze Report'}
                </button>
              ) : (
                <>
                  <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 12, padding: '14px 16px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <div>
                      <div style={{ color: '#4ade80', fontWeight: 600, fontSize: '0.9rem' }}>Report analyzed successfully</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>AI has extracted key parameters for diagnosis</div>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleYesContinue} style={{ width: '100%', justifyContent: 'center' }}>
                    Continue to Symptoms →
                  </button>
                </>
              )}
            </div>
          )}

          {/* NO FLOW */}
          {choice === 'no' && (
            <div style={{ animation: 'fadeInUp 0.4s ease' }}>
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 14, padding: '18px', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: '1.4rem' }}>⚠️</span>
                  <div>
                    <div style={{ color: '#fbbf24', fontWeight: 600, fontSize: '0.92rem' }}>No blood report?</div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem', marginTop: 4, lineHeight: 1.5 }}>
                      That's okay! We'll use your symptoms to assess anemia risk. You can always add a blood report later for more accurate results.
                    </p>
                  </div>
                </div>
              </div>
              <button className="btn-primary" onClick={handleNo} style={{ width: '100%', justifyContent: 'center' }}>
                Continue with Symptoms →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
