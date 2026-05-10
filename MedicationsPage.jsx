import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const AVOID_DRUGS = [
  { name: 'Isotretinoin', category: 'Retinoids', effect: 'Severe congenital malformations' },
  { name: 'Acitretin', category: 'Retinoids', effect: 'Severe congenital malformations' },
  { name: 'Methotrexate', category: 'Anticancer', effect: 'Abortion and fetal defects' },
  { name: 'Cyclophosphamide', category: 'Anticancer', effect: 'Abortion and fetal defects' },
  { name: 'Valproic acid', category: 'Antiepileptic', effect: 'Neural tube defects, cleft palate' },
  { name: 'Phenytoin', category: 'Antiepileptic', effect: 'Neural tube defects, cleft palate' },
  { name: 'Carbamazepine', category: 'Antiepileptic', effect: 'Neural tube defects, cleft palate' },
  { name: 'Warfarin', category: 'Anticoagulants', effect: 'Fetal warfarin syndrome', safer: 'Heparin' },
  { name: 'Tetracycline', category: 'Antibiotics', effect: 'Tooth discoloration, bone growth inhibition' },
  { name: 'Doxycycline', category: 'Antibiotics', effect: 'Tooth discoloration, bone growth inhibition' },
  { name: 'Streptomycin', category: 'Antibiotics', effect: 'Deafness' },
  { name: 'Gentamicin', category: 'Antibiotics', effect: 'Deafness' },
  { name: 'Chloramphenicol', category: 'Antibiotics', effect: 'Gray baby syndrome' },
  { name: 'Ciprofloxacin', category: 'Antibiotics', effect: 'Cartilage damage' },
  { name: 'Levofloxacin', category: 'Antibiotics', effect: 'Cartilage damage' },
  { name: 'Enalapril', category: 'Antihypertensives', effect: 'Fetal kidney damage, oligohydramnios' },
  { name: 'Lisinopril', category: 'Antihypertensives', effect: 'Fetal kidney damage, oligohydramnios' },
  { name: 'Losartan', category: 'Antihypertensives', effect: 'Fetal kidney damage, oligohydramnios' },
  { name: 'Danazol', category: 'Hormonal', effect: 'Virilization of female fetus' },
  { name: 'Lithium', category: 'Psychiatric', effect: 'Ebstein anomaly' },
  { name: 'Ibuprofen', category: 'NSAIDs (especially 3rd trimester)', effect: 'Premature closure of ductus arteriosus', safer: 'Paracetamol' },
  { name: 'Indomethacin', category: 'NSAIDs', effect: 'Premature closure of ductus arteriosus' },
  { name: 'Thalidomide', category: 'Miscellaneous', effect: 'Limb defects' },
  { name: 'Misoprostol', category: 'Miscellaneous', effect: 'Abortion' },
  { name: 'Alcohol', category: 'Miscellaneous', effect: 'Fetal alcohol syndrome' },
  { name: 'Nicotine', category: 'Miscellaneous', effect: 'Low birth weight' },
  { name: 'Smoking', category: 'Miscellaneous', effect: 'Low birth weight' },
  { name: 'Cocaine', category: 'Miscellaneous', effect: 'Fetal growth restriction' },
];

const SAFE_DRUGS = [
  { name: 'Paracetamol', use: 'Fever/Pain' },
  { name: 'Penicillin', use: 'Antibiotics' },
  { name: 'Amoxicillin', use: 'Antibiotics' },
  { name: 'Cephalosporins', use: 'Antibiotics' },
  { name: 'Heparin', use: 'Anticoagulant (instead of warfarin)' },
  { name: 'Insulin', use: 'Diabetes management' },
];

export default function MedicationsPage() {
  const { navigate, addNotification } = useContext(AppContext);
  const [meds, setMeds] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [analysis, setAnalysis] = useState([]);

  const addMed = () => {
    if (!inputValue.trim()) return;
    const newMed = inputValue.trim();
    if (meds.includes(newMed)) {
      addNotification('Medication already added', 'warning');
      return;
    }
    setMeds([...meds, newMed]);
    setInputValue('');
  };

  const removeMed = (index) => {
    setMeds(meds.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const results = meds.map(med => {
      const match = AVOID_DRUGS.find(d => 
        med.toLowerCase().includes(d.name.toLowerCase()) || 
        d.name.toLowerCase().includes(med.toLowerCase())
      );
      if (match) {
        return { name: med, status: 'avoid', ...match };
      }
      const safeMatch = SAFE_DRUGS.find(d => 
        med.toLowerCase().includes(d.name.toLowerCase()) || 
        d.name.toLowerCase().includes(med.toLowerCase())
      );
      if (safeMatch) {
        return { name: med, status: 'safe', ...safeMatch };
      }
      return { name: med, status: 'unknown' };
    });
    setAnalysis(results);
  }, [meds]);

  const handleNext = () => {
    const dangerousMeds = analysis.filter(a => a.status === 'avoid');
    if (dangerousMeds.length > 0) {
      addNotification('Please review the analysis for medications to avoid.', 'danger');
    }
    navigate('bloodTest');
  };

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('menstrualDetails')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: '#FFB6C1', fontWeight: 600, fontFamily: 'Outfit' }}>Medications & Supplements</span>
        </div>
      </div>

      <div className="page-content">
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💊</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: '#FFB6C1' }}>What are you taking?</h2>
            <p style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.9rem', marginTop: 6 }}>Enter medications, tablets, or supplements you consume regularly.</p>
          </div>

          <div className="premium-card" style={{ padding: '28px 24px', marginBottom: 24 }}>
            <div className="form-group" style={{ display: 'flex', gap: 12 }}>
              <input 
                className="form-input" 
                placeholder="Enter tablet/medicine name..." 
                value={inputValue} 
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addMed()}
              />
              <button className="btn-primary" onClick={addMed} style={{ padding: '12px 24px' }}>Add</button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
              {meds.map((med, i) => (
                <div key={i} style={{ 
                  background: 'rgba(214,51,108,0.15)', 
                  padding: '6px 14px', 
                  borderRadius: 20, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  border: '1px solid rgba(214,51,108,0.3)'
                }}>
                  <span style={{ color: '#fff', fontSize: '0.9rem' }}>{med}</span>
                  <button onClick={() => removeMed(i)} style={{ background: 'none', border: 'none', color: '#FF4081', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {analysis.length > 0 && (
            <div style={{ marginBottom: 32, animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ color: '#FFB6C1', fontFamily: 'Outfit', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>🔬 AI Medication Analysis</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {analysis.map((item, i) => (
                  <div key={i} className="premium-card" style={{ 
                    padding: '20px', 
                    borderLeft: `4px solid ${item.status === 'avoid' ? '#f87171' : item.status === 'safe' ? '#4ade80' : 'rgba(214,51,108,0.3)'}` 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>{item.name}</h4>
                      <span className={`badge ${item.status === 'avoid' ? 'badge-danger' : item.status === 'safe' ? 'badge-success' : 'badge-rose'}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {item.status === 'avoid' && (
                      <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <p style={{ color: '#f87171', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>⚠️ Potential Risk: {item.effect}</p>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Category: {item.category}</p>
                        {item.safer && <p style={{ color: '#4ade80', fontSize: '0.85rem', marginTop: 8 }}>💡 Suggestion: Consider {item.safer} after consulting your doctor.</p>}
                        <div style={{ background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '10px', marginTop: 12 }}>
                          <p style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>🛑 STOP / CONSULT DOCTOR</p>
                        </div>
                      </div>
                    )}

                    {item.status === 'safe' && (
                      <div>
                        <p style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>✅ Generally Safe: {item.use}</p>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: 4 }}>Continue as prescribed by your doctor.</p>
                      </div>
                    )}

                    {item.status === 'unknown' && (
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>No specific pregnancy risk data found in our database. Please consult your physician.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="premium-card" style={{ padding: '24px', marginBottom: 24, background: 'rgba(74,222,128,0.05)', borderColor: 'rgba(74,222,128,0.2)' }}>
            <h4 style={{ color: '#86efac', fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>🌟 Safest Alternatives</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {SAFE_DRUGS.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#4ade80' }}>✔</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{d.name} ({d.use})</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(214,51,108,0.1)', borderRadius: 16, padding: '20px', border: '1px solid rgba(214,51,108,0.3)', marginBottom: 24 }}>
            <h4 style={{ color: '#FFB6C1', fontFamily: 'Outfit', fontWeight: 700, marginBottom: 10 }}>💡 Mnemonic: WAR FAT LAD (Avoid)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
              {[
                ['W','Warfarin'],['A','ACE inhibitors'],['R','Retinoids'],
                ['F','Fluoroquinolones'],['A','Alcohol'],['T','Tetracyclines'],
                ['L','Lithium'],['A','Antiepileptics'],['D','Drugs of abuse']
              ].map(([l,d]) => (
                <div key={l} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#D6336C,#FF4081)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>{l}</div>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
            Continue to Blood Test →
          </button>
        </div>
      </div>
    </div>
  );
}
