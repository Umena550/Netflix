import { useState } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [prefillEmail, setPrefillEmail] = useState('');
  const [user, setUser] = useState(null);

  if (screen === 'landing') {
    return (
      <LandingPage
        onGetStarted={(email) => {
          setPrefillEmail(email);
          setScreen('login');
        }}
      />
    );
  }

  if (screen === 'login') {
    return (
      <LoginPage
        prefillEmail={prefillEmail}
        onLogin={(userData) => {
          setUser(userData);
          setScreen('home');
        }}
        onBack={() => setScreen('landing')}
      />
    );
  }

  return (
    <HomePage
      user={user}
      onLogout={() => {
        setUser(null);
        setScreen('landing');
      }}
    />
  );
}
