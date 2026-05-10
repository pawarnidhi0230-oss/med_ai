import React from 'react';

export default function Notifications({ items }) {
  if (!items || items.length === 0) return null;

  const typeStyles = {
    success: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.35)', icon: '✅', color: '#4ade80' },
    warning: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)', icon: '⚠️', color: '#fbbf24' },
    danger:  { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.35)', icon: '🚨', color: '#f87171' },
    info:    { bg: 'rgba(214,51,108,0.12)', border: 'rgba(214,51,108,0.35)', icon: '💊', color: '#FFB6C1' },
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, width: 'calc(100% - 40px)' }}>
      {items.map(item => {
        const s = typeStyles[item.type] || typeStyles.info;
        return (
          <div key={item.id} style={{
            background: `linear-gradient(135deg, rgba(26,10,16,0.97), rgba(42,18,32,0.95))`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${s.border}`,
            borderLeft: `3px solid ${s.color}`,
            borderRadius: 14,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${s.border}`,
            animation: 'slideInRight 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{s.icon}</span>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.86rem', lineHeight: 1.5, fontFamily: 'Outfit', margin: 0 }}>{item.msg}</p>
          </div>
        );
      })}
    </div>
  );
}
