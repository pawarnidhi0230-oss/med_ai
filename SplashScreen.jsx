import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function SplashScreen() {
  const { navigate } = useContext(AppContext);
  const [phase, setPhase] = useState('enter'); // enter → show → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 300);
    const t2 = setTimeout(() => setPhase('exit'), 4500);
    const t3 = setTimeout(() => navigate('language'), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #3d0f25 0%, #1a0a10 60%, #0d0508 100%)',
      transition: 'opacity 0.7s ease',
      opacity: phase === 'exit' ? 0 : 1,
    }}>
      {/* Glow rings */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {[200, 320, 440, 560].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(214,51,108,${0.25 - i * 0.05})`,
            animation: `pulse-glow ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      {/* Logo Container */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
        transform: phase === 'show' ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
        opacity: phase === 'show' ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Pregnant Woman Logo */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 140, height: 140,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(214,51,108,0.2), rgba(255,64,129,0.1))',
            border: '2px solid rgba(214,51,108,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(214,51,108,0.5), 0 0 80px rgba(214,51,108,0.2)',
            animation: 'float 3s ease-in-out infinite',
            overflow: 'hidden'
          }}>
            <img src="/logo.png" alt="NutriShield Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Heart pulse */}
          <div style={{
            position: 'absolute', bottom: -5, right: -5,
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #D6336C, #FF4081)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 0 15px rgba(214,51,108,0.7)',
            animation: 'heartbeat 1.5s ease-in-out infinite',
          }}>❤️</div>
        </div>

        {/* App Name */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FFB6C1, #FF4081, #D6336C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
            textShadow: 'none',
            marginBottom: 8,
          }}>
            NutriShield
          </h1>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
            fontWeight: 600,
            color: '#FFB6C1',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            opacity: 0.9,
          }}>
            Mother Care
          </h2>
          <p style={{
            marginTop: 12,
            color: 'rgba(255,182,193,0.7)',
            fontSize: '0.9rem',
            letterSpacing: '1px',
            fontWeight: 300,
          }}>
            AI-Powered Maternal Health
          </p>
        </div>

        {/* Loading dots */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: '#D6336C',
              animation: `pulse-glow 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: 'absolute', bottom: 40,
        color: 'rgba(255,182,193,0.5)',
        fontSize: '0.8rem',
        letterSpacing: '1px',
        textAlign: 'center',
        opacity: phase === 'show' ? 1 : 0,
        transition: 'opacity 1s ease 0.5s',
      }}>
        Maternal Nutrition & Anemia Alert System
      </div>
    </div>
  );
}

