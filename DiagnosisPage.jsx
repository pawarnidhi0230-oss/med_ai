import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

function analyzeAnemia(symptomsData, bloodTestData) {
  const s = symptomsData?.selected || [];
  const bt = bloodTestData?.extraInfo || {};
  const hb = parseFloat(bt.hb) || null;
  const mcv = parseFloat(bt.mcv) || null;
  const ferritin = parseFloat(bt.ferritin) || null;
  const pallor = ['skin_pale','palm_pale','lip_pale','eye_pale'].filter(x => s.includes(x)).length;
  const other = s.filter(x => !['skin_pale','palm_pale','lip_pale','eye_pale'].includes(x)).length;

  let anemiaType = null, severity = 'normal', confidence = 0, riskScore = 0;

  if (hb !== null) {
    if (hb < 7) severity = 'severe';
    else if (hb < 10) severity = 'moderate';
    else if (hb < 11) severity = 'mild';
    riskScore += hb < 11 ? (11 - hb) * 15 : 0;
  }

  if (ferritin !== null && ferritin < 15) { anemiaType = 'iron'; confidence = 85; }
  else if (mcv !== null && mcv < 80) { anemiaType = 'iron'; confidence = 78; }
  else if (mcv !== null && mcv > 100) { anemiaType = 'vitamin'; confidence = 75; }
  else if (pallor >= 3 && other >= 3) { anemiaType = 'iron'; confidence = 65; }
  else if (pallor >= 2 || other >= 4) { anemiaType = 'iron'; confidence = 55; }

  riskScore += pallor * 10 + other * 6;
  riskScore = Math.min(riskScore, 100);

  const isAnemic = anemiaType !== null || riskScore >= 35 || s.length >= 5 || (hb !== null && hb < 11);
  if (!isAnemic) return { isAnemic: false, anemiaType: null, severity: 'normal', riskScore: Math.max(10, riskScore), confidence: 0 };
  if (!anemiaType) { anemiaType = 'iron'; confidence = 50; }
  if (severity === 'normal') severity = riskScore >= 70 ? 'moderate' : 'mild';
  return { isAnemic: true, anemiaType, severity, riskScore: Math.max(riskScore, 40), confidence };
}

const ANEMIA_INFO = {
  iron: { name: 'Iron Deficiency Anemia', icon: '🩸', color: '#FF4081', desc: 'Most common type in pregnancy. Insufficient iron to produce haemoglobin for you and your baby.', urgency: 'Start iron-rich diet and prescribed iron supplements. Consult your doctor.' },
  vitamin: { name: 'Vitamin Deficiency Anemia', icon: '🟡', color: '#fbbf24', desc: 'Caused by insufficient folic acid or Vitamin B12, affecting red blood cell production.', urgency: 'Folic acid supplementation is critical, especially in first trimester.' },
  aplastic: { name: 'Aplastic Anemia', icon: '⚪', color: '#94a3b8', desc: 'Rare but serious — body stops producing enough red blood cells.', urgency: 'Seek immediate medical attention. Requires specialist care.' },
  chronic: { name: 'Anemia of Chronic Disease', icon: '🔶', color: '#f97316', desc: 'Results from underlying chronic conditions affecting red blood cell production.', urgency: 'Treat the underlying condition. Regular monitoring required.' },
  hemolytic: { name: 'Hemolytic Anemia', icon: '🔴', color: '#ef4444', desc: 'The body destroys red blood cells faster than they can be produced.', urgency: 'Immediate medical evaluation required.' },
};

function RiskRing({ score, color }) {
  const r = 60, circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
      <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
        <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dasharray 1.2s ease' }} />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color }}>{score}</div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Risk Score</div>
      </div>
    </div>
  );
}

export default function DiagnosisPage() {
  const { navigate, symptomsData, bloodTestData, setDiagnosisResult, addNotification } = useContext(AppContext);
  const [analyzing, setAnalyzing] = useState(true);
  const [result, setResult] = useState(null);
  const [userChoice, setUserChoice] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      const r = analyzeAnemia(symptomsData, bloodTestData);
      setResult(r); setDiagnosisResult(r); setAnalyzing(false);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const handleChoice = (choice) => {
    setUserChoice(choice);
    addNotification(choice === 'anemic' ? 'Anemia diet plan generated! 🥗' : 'Normal pregnancy diet ready! 🌿', 'success');
    setTimeout(() => navigate('dietPlan'), 400);
  };

  const info = result?.anemiaType ? ANEMIA_INFO[result.anemiaType] : null;
  const ringColor = result ? (result.isAnemic ? (info?.color || '#FF4081') : '#4ade80') : '#D6336C';
  const sevColor = { normal: '#4ade80', mild: '#fbbf24', moderate: '#f97316', severe: '#ef4444' };

  if (analyzing) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ width: 80, height: 80, border: '4px solid rgba(214,51,108,0.2)', borderTop: '4px solid #D6336C', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#FFB6C1', fontSize: '1.4rem', marginBottom: 8 }}>AI Analyzing...</h2>
        <p style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.9rem' }}>Processing symptoms and blood report data</p>
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('symptoms')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}><span style={{ color: '#FFB6C1', fontWeight: 600, fontFamily: 'Outfit' }}>AI Diagnosis</span></div>
      </div>
      <div className="page-content">
        <div style={{ animation: 'fadeInUp 0.6s ease' }}>
          <div className="premium-card" style={{ padding: '28px 24px', marginBottom: 20, textAlign: 'center' }}>
            <RiskRing score={result?.riskScore || 0} color={ringColor} />
            <div style={{ marginTop: 16 }}>
              <span className={`badge ${result?.isAnemic ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.9rem', padding: '6px 18px' }}>
                {result?.isAnemic ? '⚠️ Anemia Detected' : '✅ Normal Range'}
              </span>
            </div>
            {result?.severity !== 'normal' && (
              <div style={{ marginTop: 8, color: sevColor[result?.severity], fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>
                {result?.severity} Severity
              </div>
            )}
          </div>

          {result?.isAnemic && info && (
            <div className="premium-card" style={{ padding: '24px', marginBottom: 20, borderColor: `${info.color}44` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: '1.8rem' }}>{info.icon}</span>
                <div>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: info.color, fontSize: '1.05rem' }}>{info.name}</h3>
                  {result.confidence > 0 && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Confidence: {result.confidence}%</div>}
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 12 }}>{info.desc}</p>
              <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ color: '#f87171', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>⚠️ Action Required</div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.5 }}>{info.urgency}</p>
              </div>
            </div>
          )}

          {!result?.isAnemic && (
            <div className="premium-card" style={{ padding: '24px', marginBottom: 20, borderColor: 'rgba(74,222,128,0.3)' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: '2rem' }}>✅</span>
                <div>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#4ade80', marginBottom: 6 }}>No Anemia Detected</h3>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.6 }}>Based on your symptoms and blood values, you appear healthy. Continue your balanced pregnancy diet and regular checkups.</p>
                </div>
              </div>
            </div>
          )}

          <div className="premium-card" style={{ padding: '24px', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#FFB6C1', marginBottom: 6, fontSize: '1rem' }}>
              📋 Confirm your status for personalised plan:
            </h3>
            <p style={{ color: 'rgba(255,182,193,0.55)', fontSize: '0.85rem', marginBottom: 16 }}>This helps generate the most accurate diet and supplement plan for you.</p>
            <div className="option-group">
              <button className={`option-btn ${userChoice === 'anemic' ? 'selected' : ''}`} onClick={() => handleChoice('anemic')}>🩸 I am Anemic</button>
              <button className={`option-btn ${userChoice === 'normal' ? 'selected' : ''}`} onClick={() => handleChoice('normal')}>💚 I am Normal</button>
            </div>
          </div>

          <button className="btn-secondary" onClick={() => navigate('dietPlan')} style={{ width: '100%', justifyContent: 'center' }}>View Diet Plan →</button>
        </div>
      </div>
    </div>
  );
}
