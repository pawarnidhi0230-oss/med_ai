import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function LanguageSelect() {
  const { lang, setLang, navigate, t } = useContext(AppContext);

  const languages = [
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🏴' },
  ];

  return (
    <div className="page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '100%', maxWidth: 800, animation: 'fadeInUp 0.6s ease' }}>
        {/* Logo small */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(214,51,108,0.2), rgba(255,64,129,0.1))',
            border: '2px solid rgba(214,51,108,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(214,51,108,0.4)',
            overflow: 'hidden'
          }}>
            <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.6rem', background: 'linear-gradient(135deg, #FFB6C1, #FF4081)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>NutriShield Mother Care</h1>
        </div>

        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.4rem', color: '#FFB6C1', textAlign: 'center', marginBottom: 8 }}>
            {t.selectLanguage}
          </h2>
          <p style={{ color: 'rgba(255,182,193,0.6)', textAlign: 'center', fontSize: '0.9rem', marginBottom: 32 }}>
            Choose your preferred language / अपनी भाषा चुनें / ನಿಮ್ಮ ಭಾಷೆ ಆರಿಸಿ
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 32 }}>
            {languages.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '18px 22px', borderRadius: 14,
                border: `2px solid ${lang === l.code ? '#D6336C' : 'rgba(214,51,108,0.25)'}`,
                background: lang === l.code ? 'linear-gradient(135deg, rgba(214,51,108,0.2), rgba(255,64,129,0.1))' : 'rgba(255,255,255,0.03)',
                cursor: 'pointer', transition: 'all 0.3s ease',
                boxShadow: lang === l.code ? '0 0 20px rgba(214,51,108,0.3)' : 'none',
              }}>
                <span style={{ fontSize: '1.8rem' }}>{l.flag}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: lang === l.code ? '#fff' : 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '1rem', fontFamily: 'Outfit' }}>{l.label}</div>
                  <div style={{ color: 'rgba(255,182,193,0.7)', fontSize: '0.85rem', fontWeight: 400 }}>{l.native}</div>
                </div>
                {lang === l.code && (
                  <div style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #D6336C, #FF4081)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                )}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={() => navigate('permissions')} style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '16px' }}>
            {t.continue} →
          </button>
        </div>
      </div>
    </div>
  );
}
