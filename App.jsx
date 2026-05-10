import React, { useState, useEffect } from 'react';
import { AppContext, translations } from './context/AppContext';
import SplashScreen from './components/SplashScreen';
import LanguageSelect from './components/LanguageSelect';
import Permissions from './components/Permissions';
import UserDetails from './components/UserDetails';
import PregnancyDetails from './components/PregnancyDetails';
import MenstrualDetails from './components/MenstrualDetails';
import BloodTestPage from './components/BloodTestPage';
import SymptomsPage from './components/SymptomsPage';
import DiagnosisPage from './components/DiagnosisPage';
import DietPlan from './components/DietPlan';
import Dashboard from './components/Dashboard';
import MedicationsPage from './components/MedicationsPage';
import Notifications from './components/Notifications';

const SCREENS = [
  'splash', 'language', 'permissions', 'userDetails',
  'pregnancyDetails', 'menstrualDetails', 'medications', 'bloodTest',
  'symptoms', 'diagnosis', 'dietPlan', 'dashboard'
];

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [lang, setLang] = useState('en');
  const [userData, setUserData] = useState({});
  const [pregnancyData, setPregnancyData] = useState({});
  const [menstrualData, setMenstrualData] = useState({});
  const [bloodTestData, setBloodTestData] = useState({});
  const [medicationData, setMedicationData] = useState([]);
  const [symptomsData, setSymptomsData] = useState([]);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [permissions, setPermissions] = useState({ camera: false, location: false, files: false, notifications: false });
  const [notifications, setNotifications] = useState([]);

  const t = translations[lang];

  const addNotification = (msg, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4500);
  };

  const navigate = (to) => {
    setScreen(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ctx = {
    lang, setLang, t, navigate,
    userData, setUserData,
    pregnancyData, setPregnancyData,
    menstrualData, setMenstrualData,
    bloodTestData, setBloodTestData,
    medicationData, setMedicationData,
    symptomsData, setSymptomsData,
    diagnosisResult, setDiagnosisResult,
    permissions, setPermissions,
    addNotification,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <ParticlesBackground />
        {screen === 'splash' && <SplashScreen />}
        {screen === 'language' && <LanguageSelect />}
        {screen === 'permissions' && <Permissions />}
        {screen === 'userDetails' && <UserDetails />}
        {screen === 'pregnancyDetails' && <PregnancyDetails />}
        {screen === 'menstrualDetails' && <MenstrualDetails />}
        {screen === 'medications' && <MedicationsPage />}
        {screen === 'bloodTest' && <BloodTestPage />}
        {screen === 'symptoms' && <SymptomsPage />}
        {screen === 'diagnosis' && <DiagnosisPage />}
        {screen === 'dietPlan' && <DietPlan />}
        {screen === 'dashboard' && <Dashboard />}
        <Notifications items={notifications} />
      </div>
    </AppContext.Provider>
  );
}

function ParticlesBackground() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size,
          left: `${p.left}%`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        }} />
      ))}
    </div>
  );
}
