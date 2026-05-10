import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const ANEMIA_DIET = {
  earlyMorning: ['Warm water with lemon', '5–6 soaked raisins/dates'],
  breakfast: ['Ragi porridge or idli', 'Boiled egg or sprouts', 'Guava or orange juice'],
  midMorning: ['Pomegranate or apple', 'Coconut water'],
  lunch: ['Rice or chapati', 'Dal', 'Spinach curry', 'Beetroot salad', 'Fish/chicken/egg (if non-veg)', 'Lemon with food'],
  eveningSnack: ['Roasted chana or groundnuts', 'Fruit juice'],
  dinner: ['Chapati', 'Green leafy vegetable curry', 'Dal or paneer or egg'],
  bedtime: ['Milk with dates'],
};

const NORMAL_DIET = {
  earlyMorning: ['1 glass warm milk', '4–5 soaked almonds', '1 fruit (banana/apple)'],
  breakfast: ['Idli/Dosa/Upma/Chapati with vegetables', 'Egg or sprouts', 'Milk or fresh juice'],
  midMorning: ['Coconut water or fruit juice', 'Seasonal fruits'],
  lunch: ['Rice or chapati', 'Dal or pulses', 'Green leafy vegetables', 'Curd', 'Salad', 'Fish/chicken (if non-veg)'],
  eveningSnack: ['Milk or tea', 'Nuts or roasted chana or sandwich'],
  dinner: ['Chapati or rice', 'Vegetable curry', 'Dal', 'Paneer or egg or fish'],
  bedtime: ['Glass of milk'],
};

const MEAL_META = [
  { key: 'earlyMorning', label: 'Early Morning', icon: '🌅', time: '6:00 AM' },
  { key: 'breakfast', label: 'Breakfast', icon: '🍳', time: '8:00 AM' },
  { key: 'midMorning', label: 'Mid-Morning Snack', icon: '🍎', time: '10:30 AM' },
  { key: 'lunch', label: 'Lunch', icon: '🍛', time: '1:00 PM' },
  { key: 'eveningSnack', label: 'Evening Snack', icon: '🥜', time: '4:30 PM' },
  { key: 'dinner', label: 'Dinner', icon: '🥗', time: '7:30 PM' },
  { key: 'bedtime', label: 'Bedtime', icon: '🌙', time: '9:30 PM' },
];

function MealCard({ meal, items, expanded, onToggle }) {
  return (
    <div className="premium-card" style={{ marginBottom: 12, overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(214,51,108,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{meal.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Outfit', fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{meal.label}</div>
          <div style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.78rem' }}>{meal.time} · {items.length} items</div>
        </div>
        <span style={{ color: '#D6336C', transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'none' }}>▼</span>
      </div>
      {expanded && (
        <div style={{ padding: '0 20px 16px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ height: 1, background: 'rgba(214,51,108,0.15)', marginBottom: 12 }} />
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D6336C', flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem' }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DietPlan() {
  const { navigate, diagnosisResult, addNotification } = useContext(AppContext);
  const isAnemic = diagnosisResult?.isAnemic ?? true;
  const diet = isAnemic ? ANEMIA_DIET : NORMAL_DIET;
  const [expanded, setExpanded] = useState({ breakfast: true });
  const [activeTab, setActiveTab] = useState('meals');

  useEffect(() => {
    const msgs = isAnemic
      ? ['💊 Time for your Iron + Folic Acid tablet!', '🍋 Eat Vitamin C food with your next meal', '🥗 Iron-rich lunch reminder']
      : ['💊 Take your Iron supplement now', '🥛 Calcium-rich meal time!', '💧 Drink 2-3 glasses of water'];
    const timers = msgs.map((m, i) => setTimeout(() => addNotification(m, 'info'), (i + 1) * 9000));
    return () => timers.forEach(clearTimeout);
  }, []);

  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const tabs = [
    { id: 'meals', label: '🍽️ Meals' },
    { id: isAnemic ? 'ironFoods' : 'guidelines', label: isAnemic ? '🥬 Iron Foods' : '📋 Guidelines' },
    { id: 'supplements', label: '💊 Supplements' },
  ];

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('diagnosis')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}><span style={{ color: '#FFB6C1', fontWeight: 600, fontFamily: 'Outfit' }}>Your Diet Plan</span></div>
        <button onClick={() => navigate('dashboard')} style={{ padding: '8px 14px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#D6336C,#FF4081)', color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit' }}>Dashboard</button>
      </div>

      <div className="page-content">
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ borderRadius: 20, padding: '22px', marginBottom: 24, background: isAnemic ? 'linear-gradient(135deg,rgba(255,64,129,0.15),rgba(214,51,108,0.08))' : 'linear-gradient(135deg,rgba(74,222,128,0.1),rgba(34,197,94,0.05))', border: `1px solid ${isAnemic ? 'rgba(255,64,129,0.3)' : 'rgba(74,222,128,0.25)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <span style={{ fontSize: '2rem' }}>{isAnemic ? '🩸' : '🌿'}</span>
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.15rem', color: isAnemic ? '#FFB6C1' : '#86efac' }}>{isAnemic ? 'Iron Deficiency Anemia Diet' : 'Normal Pregnancy Diet'}</h2>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>Personalised for your health status</div>
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.6 }}>
              {isAnemic ? '✅ Iron-rich foods daily  ✅ Vitamin C with meals  ❌ Avoid tea/coffee after meals' : '+350 kcal/day · +23g protein · 1200mg calcium · 35-40mg iron'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '10px 6px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.78rem', background: activeTab === tab.id ? 'linear-gradient(135deg,#D6336C,#FF4081)' : 'rgba(255,255,255,0.05)', color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.55)', transition: 'all 0.3s' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'meals' && MEAL_META.map(m => (
            <MealCard key={m.key} meal={m} items={diet[m.key]} expanded={!!expanded[m.key]} onToggle={() => toggle(m.key)} />
          ))}

          {(activeTab === 'ironFoods' || activeTab === 'guidelines') && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              {isAnemic ? (
                <>
                  {[
                    { title: '🥬 Vegetarian Sources', items: ['Spinach & drumstick leaves', 'Ragi', 'Dates & jaggery', 'Beetroot', 'Beans & lentils', 'Groundnuts', 'Sesame seeds'], color: '#4ade80' },
                    { title: '🍖 Non-Vegetarian Sources', items: ['Liver', 'Red meat', 'Egg yolk', 'Fish'], color: '#f97316' },
                    { title: '🍊 Vitamin C (Boosts Iron Absorption)', items: ['Lemon', 'Orange', 'Amla', 'Guava', 'Tomato'], color: '#fbbf24' },
                    { title: '❌ Avoid Near Iron Intake', items: ['Tea & coffee', 'Junk food', 'Excess calcium with iron'], color: '#f87171' },
                  ].map((s, si) => (
                    <div key={si} className="premium-card" style={{ padding: '18px', marginBottom: 12 }}>
                      <h4 style={{ color: s.color, fontFamily: 'Outfit', fontWeight: 700, marginBottom: 10, fontSize: '0.9rem' }}>{s.title}</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {s.items.map((it, j) => <span key={j} style={{ background: `${s.color}15`, border: `1px solid ${s.color}33`, borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>{it}</span>)}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { title: '✅ Include Daily', items: ['Green leafy vegetables', 'Milk and dairy', 'Fruits', 'Eggs, fish, pulses', 'Whole grains', 'Nuts & dry fruits'], color: '#4ade80' },
                    { title: '❌ Avoid', items: ['Alcohol', 'Smoking/tobacco', 'Excess caffeine', 'Junk food', 'Raw meat/unpasteurised milk'], color: '#f87171' },
                  ].map((s, si) => (
                    <div key={si} className="premium-card" style={{ padding: '18px', marginBottom: 12 }}>
                      <h4 style={{ color: s.color, fontFamily: 'Outfit', fontWeight: 700, marginBottom: 10 }}>{s.title}</h4>
                      {s.items.map((it, j) => <div key={j} style={{ padding: '6px 0', borderBottom: j < s.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', color: 'rgba(255,255,255,0.75)', fontSize: '0.87rem' }}>• {it}</div>)}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'supplements' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              {(isAnemic ? [
                { name: 'Iron + Folic Acid Tablet', dose: 'As prescribed', timing: 'After meals', icon: '💊', note: 'Best with citrus juice. Not with tea/coffee.' },
                { name: 'Vitamin C', dose: '500mg', timing: 'With iron tablet', icon: '🍊', note: 'Enhances iron absorption significantly.' },
              ] : [
                { name: 'Iron + Folic Acid', dose: '100mg + 0.5mg', timing: 'After meals', icon: '💊', note: 'Standard prenatal prescription.' },
                { name: 'Calcium Supplement', dose: '500mg x 2', timing: 'Morning & Night', icon: '🦴', note: 'Take separately from iron for best absorption.' },
              ]).map((s, i) => (
                <div key={i} className="premium-card" style={{ padding: '18px', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(214,51,108,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{s.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#FFB6C1', marginBottom: 6 }}>{s.name}</div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span className="badge badge-rose">{s.dose}</span><span className="badge badge-rose">⏰ {s.timing}</span></div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.5 }}>{s.note}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 14, padding: '14px' }}>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.83rem', lineHeight: 1.5 }}>⚠️ Always take supplements as prescribed by your doctor. Do not self-medicate.</p>
              </div>
            </div>
          )}

          <button className="btn-primary" onClick={() => navigate('dashboard')} style={{ width: '100%', justifyContent: 'center', marginTop: 24, padding: '16px' }}>
            View Health Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
