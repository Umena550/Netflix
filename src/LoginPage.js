import { useState } from 'react';

const NetflixLogo = () => (
  <svg width="120" height="32" viewBox="0 0 111 30" fill="none">
    <path d="M105.062 14.28L111 30c-1.961-.537-3.945-1.049-5.937-1.537L99.698 17.8l-5.345 10.255c-1.969-.471-3.937-.898-5.914-1.29L95 14.28 89.362 0h5.603l4.718 11.47L104.726 0H111l-5.938 14.28zM80.112 0v27.855c1.973.167 3.946.378 5.937.629V0h-5.937zM64.998 0v26.306a180.12 180.12 0 0 1 5.937.453V0h-5.937zM50 0v25.518a171.06 171.06 0 0 1 5.937.303V0H50zm-14.937 0v24.777c1.986.085 3.969.192 5.951.322V0H35.063zM20.126 0v24.032c1.983.036 3.967.106 5.937.2V0h-5.937zM0 0v30c1.961-.002 3.937.04 5.937.12V0H0z" fill="#E50914"/>
  </svg>
);

export default function LoginPage({ onLogin, onBack, prefillEmail = '' }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, name: name || email.split('@')[0] });
    }, 1200);
  };

  const inp = {
    background: 'rgba(51,51,51,0.8)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 4, padding: '18px 16px', fontSize: 15, color: 'white',
    outline: 'none', width: '100%', fontFamily: 'inherit', transition: 'border 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Background image-like gradient */}
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg,#141414 0%,#1a1a1a 100%)', zIndex: -1 }} />

      <header style={{ position: 'relative', zIndex: 10, padding: '22px 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div onClick={onBack} style={{ cursor: 'pointer', display: 'inline-block' }}>
          <NetflixLogo />
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', zIndex: 10 }}>
        <div style={{
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
          borderRadius: 4, padding: '60px 68px', width: '100%', maxWidth: 450,
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          animation: 'fadeUp 0.35s ease',
        }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 28 }}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isSignUp && (
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inp} />
            )}
            <input type="email" placeholder="Email or mobile number" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inp} />

            {error && (
              <div style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.5)', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#ff6b6b' }}>{error}</div>
            )}

            <button type="submit" disabled={loading}
              style={{ background: '#e50914', color: 'white', border: 'none', borderRadius: 4, padding: '17px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, fontFamily: 'inherit', opacity: loading ? 0.8 : 1 }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#f40612')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = '#e50914')}
            >
              {loading ? 'Signing in...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            {!isSignUp && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', gap: 7, alignItems: 'center', color: '#b3b3b3', fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#e50914' }} /> Remember me
                </label>
                <span style={{ color: '#b3b3b3', fontSize: 13, cursor: 'pointer' }}>Need help?</span>
              </div>
            )}
          </form>

          <div style={{ marginTop: 44, color: '#737373', fontSize: 16 }}>
            {isSignUp ? 'Already have an account? ' : 'New to Netflix? '}
            <span onClick={() => { setIsSignUp(!isSignUp); setError(''); }} style={{ color: 'white', cursor: 'pointer', fontWeight: 600 }}>
              {isSignUp ? 'Sign in now.' : 'Sign up now.'}
            </span>
          </div>

          <p style={{ marginTop: 14, color: '#8c8c8c', fontSize: 13, lineHeight: 1.6 }}>
            This page is protected by Google reCAPTCHA. <span style={{ color: '#0071eb', cursor: 'pointer' }}>Learn more.</span>
          </p>

          <div style={{ marginTop: 18, background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '11px 14px', fontSize: 12, color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }}>
            💡 <strong style={{ color: '#ddd' }}>Demo:</strong> Any email + 6+ char password works.
          </div>
        </div>
      </div>

      <footer style={{ position: 'relative', zIndex: 10, padding: '20px 48px', background: 'rgba(0,0,0,0.8)' }}>
        <p style={{ color: '#737373', fontSize: 13, marginBottom: 14 }}>Questions? Call 000-800-919-1694</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          {['FAQ', 'Help Center', 'Terms of Use', 'Privacy', 'Cookie Preferences', 'Corporate Information'].map(i => (
            <span key={i} style={{ color: '#737373', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>{i}</span>
          ))}
        </div>
      </footer>

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
