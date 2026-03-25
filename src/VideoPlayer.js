import { useState } from 'react';

export default function VideoPlayer({ movie, onClose }) {
  const [unavailable, setUnavailable] = useState(false);

  if (!movie) return null;

  const youtubeUrl = `https://www.youtube.com/watch?v=${movie.videoId}`;
  const embedSrc = `https://www.youtube.com/embed/${movie.videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)',
        zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 960, position: 'relative' }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -48, right: 0, background: 'transparent',
            border: '2px solid #888', color: 'white', borderRadius: '50%',
            width: 38, height: 38, cursor: 'pointer', fontSize: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Title */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: movie.accentColor || '#e50914',
            boxShadow: `0 0 10px ${movie.accentColor || '#e50914'}`,
            flexShrink: 0,
          }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{movie.title}</h2>
          <span style={{ color: '#aaa', fontSize: 13, border: '1px solid #555', padding: '2px 8px', borderRadius: 3 }}>
            {movie.rating}
          </span>
        </div>

        {/* YouTube iframe or Fallback */}
        <div style={{
          position: 'relative', paddingBottom: '56.25%', height: 0,
          borderRadius: 10, overflow: 'hidden',
          boxShadow: '0 30px 100px rgba(0,0,0,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#0a0a0a',
        }}>
          {!unavailable ? (
            <iframe
              key={movie.videoId}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              src={embedSrc}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setUnavailable(true)}
            />
          ) : null}

          {/* Fallback overlay — shown if embed fails OR as a persistent button */}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 16,
              background: unavailable
                ? 'linear-gradient(135deg,#0a0a0a,#1a1a1a)'
                : 'transparent',
              pointerEvents: unavailable ? 'auto' : 'none',
              opacity: unavailable ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          >
            <div style={{ fontSize: 48 }}>📺</div>
            <p style={{ color: '#ccc', fontSize: 16, textAlign: 'center', margin: 0 }}>
              This video isn't available here.
            </p>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#ff0000', color: 'white', fontWeight: 700,
                fontSize: 15, padding: '12px 28px', borderRadius: 6,
                textDecoration: 'none', letterSpacing: 0.3,
                boxShadow: '0 4px 20px rgba(255,0,0,0.4)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.38 12.38 0 00-8.19 5.28 12.38 12.38 0 00-1.87 9.82 12.38 12.38 0 009.36 2.82 12.38 12.38 0 008.55-6.12 4.83 4.83 0 01-4.08-9.05zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
              </svg>
              Watch on YouTube
            </a>
          </div>
        </div>

        {/* Always-visible YouTube link below player */}
        <div style={{ display: 'flex', gap: 20, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: '#46d369', fontWeight: 700, fontSize: 14 }}>{movie.match}% Match</span>
          <span style={{ color: '#aaa', fontSize: 13 }}>{movie.year}</span>
          <span style={{ color: '#aaa', fontSize: 13 }}>{movie.duration}</span>
          <span style={{ color: '#888', fontSize: 13 }}>{movie.genre}</span>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: 'auto', color: '#aaa', fontSize: 12,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5,
              border: '1px solid #444', padding: '4px 12px', borderRadius: 4,
            }}
            title="Open trailer on YouTube"
          >
            <svg viewBox="0 0 24 24" fill="#ff0000" width="14" height="14">
              <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.2 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5v-5.5l5.7 2.8-5.7 2.7z"/>
            </svg>
            Open on YouTube
          </a>
          <div style={{ display: 'flex', gap: 6 }}>
            {(movie.tags || []).map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.1)', fontSize: 12, padding: '3px 10px', borderRadius: 20, color: '#ccc' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
