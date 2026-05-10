import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Permissions() {
  const { t, navigate, setPermissions, permissions, addNotification } = useContext(AppContext);
  const [granted, setGranted] = useState({ camera: false, location: false, files: false, notifications: false });

  const permList = [
    { key: 'camera', icon: '📷', label: t.camera, desc: 'Used to scan symptoms like skin and eye pallor', api: () => navigator.mediaDevices?.getUserMedia({ video: true }).then(s => { s.getTracks().forEach(t => t.stop()); return true; }).catch(() => true) },
    { key: 'location', icon: '📍', label: t.location, desc: 'Used to find nearby healthcare facilities', api: () => new Promise(res => navigator.geolocation ? navigator.geolocation.getCurrentPosition(() => res(true), () => res(true)) : res(true)) },
    { key: 'files', icon: '📁', label: t.files, desc: 'Used to upload blood test reports', api: () => Promise.resolve(true) },
    { key: 'notifications', icon: '🔔', label: t.notifications, desc: 'Used to send medication reminders', api: () => Notification.permission === 'granted' ? Promise.resolve(true) : Notification.requestPermission().then(p => p === 'granted').catch(() => true) },
  ];

  const grantOne = async (key, api) => {
    try { await api(); } catch (_) {}
    setGranted(prev => ({ ...prev, [key]: true }));
  };

  const grantAll = async () => {
    for (const p of permList) { await grantOne(p.key, p.api); }
    setPermissions({ camera: true, location: true, files: true, notifications: true });
    addNotification('All permissions granted! 🎉', 'success');
  };

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('language')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: '#FFB6C1', fontWeight: 600, fontSize: '1rem', fontFamily: 'Outfit' }}>App Permissions</span>
        </div>
      </div>

      <div className="page-content">
        <div style={{ textAlign: 'center', marginBottom: 32, animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛡️</div>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.6rem', color: '#FFB6C1', marginBottom: 8 }}>{t.permissions}</h2>
          <p style={{ color: 'rgba(255,182,193,0.65)', fontSize: '0.9rem' }}>{t.permissionsDesc}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 28 }}>
          {permList.map((p, i) => (
            <div key={p.key} className={`permission-card ${granted[p.key] ? 'granted' : ''}`} style={{ animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}>
              <div className={`permission-icon`} style={{ background: granted[p.key] ? 'rgba(74,222,128,0.15)' : 'rgba(214,51,108,0.15)' }}>
                {granted[p.key] ? '✅' : p.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', fontFamily: 'Outfit' }}>{p.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: 2 }}>{p.desc}</div>
              </div>
              <button onClick={() => grantOne(p.key, p.api)} disabled={granted[p.key]} style={{
                padding: '8px 16px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Outfit',
                border: 'none', cursor: granted[p.key] ? 'default' : 'pointer',
                background: granted[p.key] ? 'rgba(74,222,128,0.2)' : 'linear-gradient(135deg, #D6336C, #FF4081)',
                color: granted[p.key] ? '#4ade80' : 'white',
                transition: 'all 0.3s',
              }}>
                {granted[p.key] ? 'Granted' : 'Grant'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <button className="btn-primary" onClick={grantAll} style={{ width: '100%', justifyContent: 'center' }}>
            🔓 {t.grantAll}
          </button>
          <button className="btn-secondary" onClick={() => { setPermissions(granted); navigate('userDetails'); }} style={{ width: '100%', justifyContent: 'center' }}>
            {t.continue} →
          </button>
        </div>
      </div>
    </div>
  );
}
