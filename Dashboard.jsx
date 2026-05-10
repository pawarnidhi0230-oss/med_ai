import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Dashboard() {
  const { navigate, userData, menstrualData, diagnosisResult, symptomsData, bloodTestData, addNotification } = useContext(AppContext);
  const isAnemic = diagnosisResult?.isAnemic ?? false;
  const name = userData?.name || 'Mother';
  const edd = menstrualData?.edd;
  const riskScore = diagnosisResult?.riskScore || 0;
  const selectedSymptoms = symptomsData?.selected || [];

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const daysToEDD = () => {
    if (!edd) return null;
    const diff = new Date(edd) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const ringColor = isAnemic ? '#FF4081' : '#4ade80';
  const r = 52, circ = 2 * Math.PI * r;
  const dash = (riskScore / 100) * circ;

  const healthCards = [
    { label: 'Risk Score', value: `${riskScore}/100`, icon: '🎯', color: isAnemic ? '#FF4081' : '#4ade80', sub: isAnemic ? 'Anemia Detected' : 'Normal Range' },
    { label: 'Days to EDD', value: daysToEDD() ?? '—', icon: '👶', color: '#FFB6C1', sub: edd ? formatDate(edd) : 'Set LMD first' },
    { label: 'Symptoms', value: selectedSymptoms.length, icon: '🩺', color: '#fbbf24', sub: 'Reported symptoms' },
    { label: 'Blood Test', value: bloodTestData?.hasReport ? '✓ Done' : '✗ Pending', icon: '🧪', color: bloodTestData?.hasReport ? '#4ade80' : '#f87171', sub: bloodTestData?.hasReport ? 'AI analyzed' : 'Not uploaded' },
  ];

  const menuItems = [
    { icon: '🥗', label: 'Diet Plan', desc: 'View your personalised diet', action: () => navigate('dietPlan') },
    { icon: '🩺', label: 'Symptom Check', desc: 'Update your symptoms', action: () => navigate('symptoms') },
    { icon: '🧪', label: 'Blood Report', desc: 'Upload or update report', action: () => navigate('bloodTest') },
    { icon: '🔬', label: 'AI Diagnosis', desc: 'View detailed diagnosis', action: () => navigate('diagnosis') },
  ];

  const tips = isAnemic ? [
    '🍋 Eat Vitamin C foods with every iron-rich meal',
    '💊 Take iron tablets after food, not before',
    '🫐 Avoid tea/coffee within 1 hour of meals',
    '🥬 Include green leafy vegetables twice daily',
  ] : [
    '💧 Drink 2–3 litres of water daily',
    '🥛 Consume 3 servings of dairy per day',
    '🏃‍♀️ Light walking 20-30 mins is beneficial',
    '😴 Sleep 8–9 hours for proper fetal development',
  ];

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 16px', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(214,51,108,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.85rem' }}>Welcome back 👋</div>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg,#FFB6C1,#FF4081)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{name}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => addNotification('💊 Remember your iron tablet after lunch!', 'info')} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(214,51,108,0.15)', border: '1px solid rgba(214,51,108,0.3)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              🔔
              <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: '#FF4081', borderRadius: '50%', border: '2px solid #1a0a10' }} />
            </button>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#D6336C,#FF4081)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤰</div>
          </div>
        </div>

        {/* Status Banner */}
        <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 12, background: isAnemic ? 'rgba(255,64,129,0.12)' : 'rgba(74,222,128,0.1)', border: `1px solid ${isAnemic ? 'rgba(255,64,129,0.3)' : 'rgba(74,222,128,0.25)'}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.2rem' }}>{isAnemic ? '⚠️' : '✅'}</span>
          <div>
            <div style={{ color: isAnemic ? '#FFB6C1' : '#86efac', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'Outfit' }}>
              {isAnemic ? `${diagnosisResult?.anemiaType === 'iron' ? 'Iron Deficiency' : 'Vitamin Deficiency'} Anemia — ${diagnosisResult?.severity || 'Mild'} severity` : 'No Anemia Detected — Continue healthy habits'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>Last updated: {new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 40px', maxWidth: 700, margin: '0 auto', width: '100%' }}>
        {/* Health Score Ring + Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14, marginBottom: 20 }}>
          <div className="premium-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 110, height: 110 }}>
              <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
                <circle cx="55" cy="55" r={r} fill="none" stroke={ringColor} strokeWidth="8"
                  strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 6px ${ringColor})`, transition: 'stroke-dasharray 1s ease' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit', color: ringColor }}>{riskScore}</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)' }}>Health Score</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {healthCards.slice(1).map((card, i) => (
              <div key={i} className="premium-card" style={{ padding: '14px 12px' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{card.icon}</div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1rem', color: card.color }}>{card.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', marginTop: 2 }}>{card.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EDD Progress */}
        {edd && (
          <div className="premium-card" style={{ padding: '18px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#FFB6C1', fontSize: '0.95rem' }}>👶 Pregnancy Progress</div>
              <span style={{ color: 'rgba(255,182,193,0.7)', fontSize: '0.8rem' }}>{daysToEDD()} days remaining</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.max(5, 100 - ((daysToEDD() || 0) / 280) * 100)}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
              <span>Today</span><span>EDD: {formatDate(edd)}</span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#FFB6C1', fontSize: '1rem', marginBottom: 14 }}>⚡ Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action} style={{ padding: '18px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(214,51,108,0.2)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'Outfit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(214,51,108,0.5)'; e.currentTarget.style.background = 'rgba(214,51,108,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(214,51,108,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{item.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>{item.desc}</div>
            </button>
          ))}
        </div>

        {/* Daily Tips */}
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#FFB6C1', fontSize: '1rem', marginBottom: 14 }}>💡 Today's Health Tips</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tips.map((tip, i) => (
            <div key={i} className="premium-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
              <div style={{ width: 4, height: 36, background: 'linear-gradient(180deg,#D6336C,#FF4081)', borderRadius: 2, flexShrink: 0 }} />
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', lineHeight: 1.5 }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* Supplement Reminder */}
        <div style={{ marginTop: 24, background: 'linear-gradient(135deg,rgba(214,51,108,0.15),rgba(255,64,129,0.08))', borderRadius: 16, padding: '20px', border: '1px solid rgba(214,51,108,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: '1.6rem' }}>💊</span>
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#FFB6C1', fontSize: '0.95rem' }}>Today's Supplements</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>Tap bell icon to get reminders</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(isAnemic ? ['💊 Iron + Folic Acid (After lunch)', '🍊 Vitamin C (With meals)'] : ['💊 Iron + Folic Acid (After lunch)', '🦴 Calcium (Morning & Night)']).map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '6px 14px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
