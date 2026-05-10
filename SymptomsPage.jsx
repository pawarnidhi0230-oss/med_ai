import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../App';

const SYMPTOMS_LIST = [
  { id: 'skin_pale', label: 'Paleness of Skin', icon: '🧴', hasCamera: true, desc: 'Upload/capture a photo of your skin' },
  { id: 'palm_pale', label: 'Paleness of Palm', icon: '🖐️', hasCamera: true, desc: 'Upload/capture a photo of your palm' },
  { id: 'lip_pale', label: 'Paleness of Lips', icon: '👄', hasCamera: true, desc: 'Upload/capture a photo of your lips' },
  { id: 'eye_pale', label: 'Paleness of Lower Palpebral Conjunctiva', icon: '👁️', hasCamera: true, desc: 'Pull lower eyelid down and capture' },
  { id: 'dizziness', label: 'Dizziness', icon: '💫', hasCamera: false },
  { id: 'breathlessness', label: 'Breathlessness', icon: '😮‍💨', hasCamera: false },
  { id: 'appetite', label: 'Loss of Appetite', icon: '🍽️', hasCamera: false },
  { id: 'concentration', label: 'Poor Concentration', icon: '🧠', hasCamera: false },
  { id: 'sleep', label: 'Disturbed Sleep', icon: '😴', hasCamera: false },
  { id: 'headache', label: 'Headache', icon: '🤕', hasCamera: false },
  { id: 'weakness', label: 'Weakness / Fatigue', icon: '😔', hasCamera: false },
];

function CameraCapture({ symptomId, label, onCapture }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState(null);
  const fileRef = useRef();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);
    } catch {
      fileRef.current?.click();
    }
  };

  const snap = () => {
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const data = canvasRef.current.toDataURL('image/jpeg');
    setCaptured(data);
    videoRef.current.srcObject?.getTracks().forEach(t => t.stop());
    setStreaming(false);
    onCapture(data);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setCaptured(ev.target.result); onCapture(ev.target.result); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(214,51,108,0.3)' }}>
      {!captured ? (
        <>
          {streaming ? (
            <div style={{ position: 'relative' }}>
              <video ref={videoRef} style={{ width: '100%', display: 'block', maxHeight: 200, objectFit: 'cover' }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ width: '60%', height: '70%', border: '2px solid #FF4081', borderRadius: 10, boxShadow: '0 0 20px rgba(255,64,129,0.5)' }} />
              </div>
              <button onClick={snap} style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #D6336C, #FF4081)', border: '3px solid white', cursor: 'pointer', fontSize: '1.2rem' }}>📸</button>
            </div>
          ) : (
            <div style={{ padding: '16px', display: 'flex', gap: 10 }}>
              <button onClick={startCamera} style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'rgba(214,51,108,0.15)', border: '1px solid rgba(214,51,108,0.4)', color: '#FFB6C1', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Outfit', fontWeight: 500 }}>
                📷 Open Camera
              </button>
              <button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Outfit', fontWeight: 500 }}>
                📁 Upload Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            </div>
          )}
        </>
      ) : (
        <div style={{ position: 'relative' }}>
          <img src={captured} alt={label} style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(74,222,128,0.9)', borderRadius: 20, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#000' }}>✓ Scanning...</div>
          <button onClick={() => { setCaptured(null); onCapture(null); }} style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.78rem' }}>Retake</button>
        </div>
      )}
    </div>
  );
}

export default function SymptomsPage() {
  const { t, navigate, setSymptomsData, bloodTestData, addNotification } = useContext(AppContext);
  const [selected, setSelected] = useState([]);
  const [captures, setCaptures] = useState({});
  const [doubts, setDoubts] = useState('');

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleCapture = (id, data) => setCaptures(prev => ({ ...prev, [id]: data }));

  const handleNext = () => {
    if (selected.length === 0) { addNotification('Please select at least one symptom', 'warning'); return; }
    setSymptomsData({ selected, captures });
    navigate('diagnosis');
  };

  const handleDoubts = (ans) => {
    if (ans === 'yes') { navigate('bloodTest'); return; }
    setSymptomsData({ selected, captures });
    navigate('diagnosis');
  };

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('bloodTest')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: '#FFB6C1', fontWeight: 600, fontFamily: 'Outfit' }}>{t.symptoms}</span>
        </div>
        <span style={{ fontSize: '0.82rem', color: '#D6336C', fontWeight: 600 }}>{selected.length} selected</span>
      </div>

      <div className="page-content">
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🩺</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: '#FFB6C1' }}>Symptom Checker</h2>
            <p style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.9rem', marginTop: 6 }}>Select all symptoms you are experiencing. You can select multiple.</p>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${(selected.length / SYMPTOMS_LIST.length) * 100}%` }} />
            </div>
            <span style={{ color: '#FFB6C1', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {selected.length} / {SYMPTOMS_LIST.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {SYMPTOMS_LIST.map((s, i) => (
              <div key={s.id} style={{ animation: `fadeInUp 0.4s ease ${i * 0.05}s both` }}>
                <div className={`symptom-checkbox ${selected.includes(s.id) ? 'checked' : ''}`} onClick={() => toggle(s.id)}>
                  <div className="check-icon">
                    {selected.includes(s.id) && <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: selected.includes(s.id) ? '#fff' : 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: '0.92rem', fontFamily: 'Outfit' }}>{s.label}</div>
                    {s.hasCamera && selected.includes(s.id) && (
                      <div style={{ color: 'rgba(255,182,193,0.7)', fontSize: '0.78rem', marginTop: 2 }}>{s.desc}</div>
                    )}
                  </div>
                  {s.hasCamera && selected.includes(s.id) && (
                    <span style={{ fontSize: '0.8rem', background: 'rgba(214,51,108,0.2)', padding: '3px 8px', borderRadius: 20, color: '#FFB6C1', fontWeight: 500 }}>📷 Photo</span>
                  )}
                </div>

                {s.hasCamera && selected.includes(s.id) && (
                  <div style={{ marginLeft: 0, animation: 'fadeInUp 0.3s ease' }}>
                    <CameraCapture symptomId={s.id} label={s.label} onCapture={(data) => handleCapture(s.id, data)} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Doubts section (only for no-blood-test path) */}
          {!bloodTestData?.hasReport && selected.length > 0 && (
            <div className="premium-card" style={{ padding: '22px', marginBottom: 20, animation: 'fadeInUp 0.4s ease' }}>
              <h3 style={{ color: '#FFB6C1', fontFamily: 'Outfit', fontWeight: 700, marginBottom: 8, fontSize: '0.95rem' }}>
                🤔 Do you suspect you may be anemic?
              </h3>
              <div className="option-group" style={{ marginTop: 12 }}>
                <button className="option-btn" onClick={() => handleDoubts('yes')}>Yes – Upload Blood Report</button>
                <button className="option-btn" onClick={() => handleDoubts('no')}>No – Continue Analysis</button>
              </div>
            </div>
          )}

          <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
            🔍 Analyze Symptoms →
          </button>
        </div>
      </div>
    </div>
  );
}
