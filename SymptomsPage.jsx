import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';

// hasCamera: shows camera/upload
// hasScan: shows AI detection result inline after capture
const SYMPTOMS_LIST = [
  { id: 'skin_pale',   label: 'Paleness of Skin',                         icon: '🧴', hasCamera: false },
  { id: 'palm_pale',   label: 'Paleness of Palm',                         icon: '🖐️', hasCamera: false },
  { id: 'lip_pale',    label: 'Paleness of Lips',                         icon: '👄', hasCamera: false },
  { id: 'eye_pale',    label: 'Paleness of Lower Palpebral Conjunctiva',  icon: '👁️', hasCamera: true,  hasScan: true,  desc: 'Pull lower eyelid down and capture the inner surface' },
  { id: 'tongue',      label: 'Photo of Tongue',                          icon: '👅', hasCamera: true,  hasScan: true,  desc: 'Open mouth, stick tongue out and capture' },
  { id: 'nails',       label: 'Photo of Nails',                           icon: '💅', hasCamera: true,  hasScan: true,  desc: 'Capture fingernails under good lighting' },
  { id: 'dizziness',   label: 'Dizziness',                               icon: '💫', hasCamera: false },
  { id: 'breathless',  label: 'Breathlessness',                           icon: '😮‍💨', hasCamera: false },
  { id: 'appetite',    label: 'Loss of Appetite',                         icon: '🍽️', hasCamera: false },
  { id: 'sleep',       label: 'Disturbed Sleep',                          icon: '😴', hasCamera: false },
  { id: 'headache',    label: 'Headache',                                 icon: '🤕', hasCamera: false },
  { id: 'weakness',    label: 'Weakness / Fatigue',                       icon: '😔', hasCamera: false },
  { id: 'concentration', label: 'Poor Concentration',                     icon: '🧠', hasCamera: false },
];

// Simulate AI scan results per symptom type
function getScanResult(id) {
  const results = {
    eye_pale: [
      { label: 'Conjunctival Pallor', detected: true,  confidence: 82, detail: 'Pale inner eyelid detected — possible iron deficiency' },
      { label: 'Conjunctival Pallor', detected: false, confidence: 91, detail: 'Normal pink conjunctiva — no pallor detected' },
    ],
    tongue: [
      { label: 'Tongue Pallor',       detected: true,  confidence: 78, detail: 'Pale / smooth tongue surface suggests nutritional deficiency' },
      { label: 'Tongue Pallor',       detected: false, confidence: 88, detail: 'Normal tongue colour and texture' },
    ],
    nails: [
      { label: 'Nail Pallor / Koilonychia', detected: true,  confidence: 75, detail: 'Pale or spoon-shaped nails detected — anemia indicator' },
      { label: 'Nail Pallor / Koilonychia', detected: false, confidence: 85, detail: 'Normal nail bed colour — no pallor detected' },
    ],
  };
  const opts = results[id] || [{ label: 'Analysis', detected: false, confidence: 80, detail: 'Normal' }];
  // Randomly pick one (simulated — in production this would be a real AI API call)
  return opts[Math.floor(Math.random() * opts.length)];
}

function ScanResult({ result }) {
  if (!result) return null;
  return (
    <div style={{
      margin: '10px 0 0',
      padding: '14px 16px',
      borderRadius: 12,
      background: result.detected
        ? 'linear-gradient(135deg,rgba(248,113,113,0.12),rgba(239,68,68,0.06))'
        : 'linear-gradient(135deg,rgba(74,222,128,0.12),rgba(34,197,94,0.06))',
      border: `1px solid ${result.detected ? 'rgba(248,113,113,0.35)' : 'rgba(74,222,128,0.35)'}`,
      animation: 'fadeInUp 0.4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: '1.1rem' }}>{result.detected ? '⚠️' : '✅'}</span>
        <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: result.detected ? '#f87171' : '#4ade80' }}>
          {result.label}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
          {result.confidence}% confidence
        </span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.83rem', lineHeight: 1.5 }}>{result.detail}</p>

      {/* Confidence bar */}
      <div style={{ marginTop: 10 }}>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${result.confidence}%`,
            background: result.detected
              ? 'linear-gradient(90deg,#f87171,#ef4444)'
              : 'linear-gradient(90deg,#4ade80,#22c55e)',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

function CameraCapture({ symptomId, hasScan, onCapture }) {
  const videoRef  = useRef();
  const canvasRef = useRef();
  const fileRef   = useRef();
  const [streaming,  setStreaming]  = useState(false);
  const [captured,   setCaptured]  = useState(null);
  const [scanning,   setScanning]  = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);
    } catch {
      fileRef.current?.click();
    }
  };

  const snap = () => {
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width  = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const data = canvasRef.current.toDataURL('image/jpeg');
    videoRef.current.srcObject?.getTracks().forEach(t => t.stop());
    setStreaming(false);
    processCapture(data);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => processCapture(ev.target.result);
    reader.readAsDataURL(file);
  };

  const processCapture = (data) => {
    setCaptured(data);
    onCapture(data, null);

    if (hasScan) {
      setScanning(true);
      setScanResult(null);
      // Simulate AI scanning delay
      setTimeout(() => {
        const result = getScanResult(symptomId);
        setScanning(false);
        setScanResult(result);
        onCapture(data, result);
      }, 2200);
    }
  };

  const reset = () => {
    setCaptured(null); setScanResult(null); setScanning(false);
    onCapture(null, null);
  };

  return (
    <div style={{ marginTop: 10 }}>
      {!captured ? (
        <>
          {streaming ? (
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(214,51,108,0.4)', position: 'relative' }}>
              <video ref={videoRef} style={{ width: '100%', display: 'block', maxHeight: 220, objectFit: 'cover' }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {/* Targeting frame */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ width: '58%', height: '65%', border: '2px solid #FF4081', borderRadius: 12, boxShadow: '0 0 20px rgba(255,64,129,0.5)' }} />
              </div>
              <button onClick={snap} style={{
                position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                width: 54, height: 54, borderRadius: '50%',
                background: 'linear-gradient(135deg,#D6336C,#FF4081)',
                border: '3px solid white', cursor: 'pointer', fontSize: '1.3rem',
                boxShadow: '0 4px 16px rgba(214,51,108,0.5)',
              }}>📸</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, padding: '0' }}>
              <button onClick={startCamera} style={{
                flex: 1, padding: '12px', borderRadius: 10,
                background: 'rgba(214,51,108,0.15)', border: '1px solid rgba(214,51,108,0.4)',
                color: '#FFB6C1', cursor: 'pointer', fontSize: '0.86rem', fontFamily: 'Outfit', fontWeight: 600,
              }}>📷 Open Camera</button>
              <button onClick={() => fileRef.current?.click()} style={{
                flex: 1, padding: '12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.86rem', fontFamily: 'Outfit', fontWeight: 600,
              }}>📁 Upload Photo</button>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFile} />
            </div>
          )}
        </>
      ) : (
        <div>
          {/* Captured image */}
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(214,51,108,0.3)' }}>
            <img src={captured} alt="Captured" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />

            {/* Scanning overlay */}
            {scanning && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, border: '3px solid rgba(214,51,108,0.3)', borderTop: '3px solid #FF4081', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ color: '#FFB6C1', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Outfit' }}>🔬 AI Scanning...</span>
                {/* Scan line animation */}
                <div style={{ position: 'absolute', width: '80%', height: 2, background: 'linear-gradient(90deg,transparent,#FF4081,transparent)', animation: 'scanLine 1.2s ease-in-out infinite' }} />
              </div>
            )}

            {!scanning && (
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <span style={{ background: scanResult?.detected ? 'rgba(248,113,113,0.9)' : 'rgba(74,222,128,0.9)', borderRadius: 20, padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700, color: '#000' }}>
                  {scanResult ? '✓ Scanned' : '📷 Captured'}
                </span>
              </div>
            )}
            <button onClick={reset} style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.76rem' }}>Retake</button>
          </div>

          {/* Inline scan result */}
          {!scanning && scanResult && <ScanResult result={scanResult} />}
        </div>
      )}
    </div>
  );
}

export default function SymptomsPage() {
  const { t, navigate, setSymptomsData, bloodTestData, addNotification } = useContext(AppContext);
  const [selected,  setSelected]  = useState([]);
  const [captures,  setCaptures]  = useState({});
  const [scanResults, setScanResults] = useState({});

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const handleCapture = (id, data, result) => {
    setCaptures(prev   => ({ ...prev, [id]: data }));
    if (result) setScanResults(prev => ({ ...prev, [id]: result }));
  };

  const handleNext = () => {
    if (selected.length === 0) { addNotification('Please select at least one symptom', 'warning'); return; }
    setSymptomsData({ selected, captures, scanResults });
    navigate('diagnosis');
  };

  const handleDoubts = (ans) => {
    if (ans === 'yes') { navigate('bloodTest'); return; }
    setSymptomsData({ selected, captures, scanResults });
    navigate('diagnosis');
  };

  // Count how many camera symptoms have been scanned
  const scanCount = SYMPTOMS_LIST.filter(s => s.hasScan && selected.includes(s.id) && scanResults[s.id]).length;
  const scanTotal = SYMPTOMS_LIST.filter(s => s.hasScan && selected.includes(s.id)).length;

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <style>{`
        @keyframes scanLine {
          0%   { top: 10%; }
          50%  { top: 85%; }
          100% { top: 10%; }
        }
      `}</style>

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
            <p style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.9rem', marginTop: 6 }}>
              Select all symptoms you experience. For scan items, capture a photo for AI detection.
            </p>
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

          {/* Scan progress badge */}
          {scanTotal > 0 && (
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(214,51,108,0.08)', border: '1px solid rgba(214,51,108,0.2)' }}>
              <span>🔬</span>
              <span style={{ color: '#FFB6C1', fontSize: '0.84rem', fontWeight: 600 }}>AI Scans: {scanCount} / {scanTotal} completed</span>
            </div>
          )}

          {/* Section: Checkboxes group */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 28 }}>
            {SYMPTOMS_LIST.map((s, i) => (
              <div key={s.id} style={{ animation: `fadeInUp 0.4s ease ${i * 0.04}s both` }}>
                {/* Checkbox row */}
                <div
                  className={`symptom-checkbox ${selected.includes(s.id) ? 'checked' : ''}`}
                  onClick={() => toggle(s.id)}
                >
                  <div className="check-icon">
                    {selected.includes(s.id) && <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: selected.includes(s.id) ? '#fff' : 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: '0.9rem', fontFamily: 'Outfit' }}>
                      {s.label}
                    </div>
                    {s.hasCamera && selected.includes(s.id) && (
                      <div style={{ color: 'rgba(255,182,193,0.65)', fontSize: '0.76rem', marginTop: 1 }}>{s.desc}</div>
                    )}
                  </div>
                  {s.hasScan && (
                    <span style={{ fontSize: '0.72rem', background: 'rgba(214,51,108,0.2)', padding: '3px 8px', borderRadius: 20, color: '#FFB6C1', fontWeight: 600, flexShrink: 0 }}>
                      🔬 AI Scan
                    </span>
                  )}
                </div>

                {/* Camera capture — only for items with hasCamera */}
                {s.hasCamera && selected.includes(s.id) && (
                  <div style={{ marginTop: 2, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '0 0 12px 12px', border: '1px solid rgba(214,51,108,0.2)', borderTop: 'none' }}>
                    <CameraCapture
                      symptomId={s.id}
                      hasScan={s.hasScan}
                      onCapture={(data, result) => handleCapture(s.id, data, result)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Doubt section for no-blood-test path */}
          {!bloodTestData?.hasReport && selected.length > 0 && (
            <div className="premium-card" style={{ padding: '22px', marginBottom: 20, animation: 'fadeInUp 0.4s ease' }}>
              <h3 style={{ color: '#FFB6C1', fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12, fontSize: '0.95rem' }}>
                🤔 Do you suspect you may be anemic?
              </h3>
              <div className="option-group">
                <button className="option-btn" onClick={() => handleDoubts('yes')}>Yes – Upload Blood Report</button>
                <button className="option-btn" onClick={() => handleDoubts('no')}>No – Continue</button>
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
