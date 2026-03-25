import { useState, useEffect, useRef } from "react";
import { MOVIES, TMDB_API_KEY, TMDB_IMG, TMDB_BG } from "./data";
import netflixLogo from "./netflix-logo.png";
const NetflixLogo = () => <img src={netflixLogo} alt="Netflix" width="120" />;

// Gradient fallback posters for the collage (shown while real images load)
const FALLBACK_POSTERS = [
  { title: "Pushpa 2", gradient: "linear-gradient(135deg,#7b2d00,#e65c00)" },
  {
    title: "Breaking Bad",
    gradient: "linear-gradient(135deg,#134e5e,#71b280)",
  },
  {
    title: "Stranger Things",
    gradient: "linear-gradient(135deg,#0f0c29,#302b63)",
  },
  { title: "Squid Game", gradient: "linear-gradient(135deg,#870000,#1f1c18)" },
  { title: "Wednesday", gradient: "linear-gradient(135deg,#1a1a1a,#434343)" },
  { title: "Money Heist", gradient: "linear-gradient(135deg,#8e0000,#c0392b)" },
  { title: "Peddha Kapu", gradient: "linear-gradient(135deg,#4a0000,#800000)" },
  {
    title: "Lucky Baskhar",
    gradient: "linear-gradient(135deg,#1a3c00,#2d6a00)",
  },
  {
    title: "Peaky Blinders",
    gradient: "linear-gradient(135deg,#1c1c1c,#6b6b6b)",
  },
  { title: "Dark", gradient: "linear-gradient(135deg,#0f0c29,#24243e)" },
  { title: "Sankranthi", gradient: "linear-gradient(135deg,#7b3f00,#f5a623)" },
  { title: "Night Agent", gradient: "linear-gradient(135deg,#001f3f,#0074d9)" },
  { title: "Stree 2", gradient: "linear-gradient(135deg,#2c003e,#6a0572)" },
  { title: "Jolly LLB 3", gradient: "linear-gradient(135deg,#003d1a,#007a35)" },
  { title: "Narcos", gradient: "linear-gradient(135deg,#e67e22,#c0392b)" },
  { title: "Animal", gradient: "linear-gradient(135deg,#1a0000,#4a0000)" },
  { title: "Ozark", gradient: "linear-gradient(135deg,#0a3d62,#1e3799)" },
  { title: "Dunki", gradient: "linear-gradient(135deg,#1a0a00,#5c3000)" },
  { title: "Mindhunter", gradient: "linear-gradient(135deg,#2c3e50,#4ca1af)" },
  { title: "Maharaja", gradient: "linear-gradient(135deg,#2c1654,#870000)" },
  {
    title: "Altered Carbon",
    gradient: "linear-gradient(135deg,#005c97,#363795)",
  },
  { title: "Cobra Kai", gradient: "linear-gradient(135deg,#f7971e,#ffd200)" },
  { title: "The Witcher", gradient: "linear-gradient(135deg,#4a0e8f,#870000)" },
  {
    title: "Peaky Blinders 2",
    gradient: "linear-gradient(135deg,#1c1c1c,#555)",
  },
];

function PosterCard({ poster, imgUrl }) {
  const [err, setErr] = useState(false);
  return (
    <div
      style={{
        width: 150,
        height: 220,
        borderRadius: 6,
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {imgUrl && !err ? (
        <img
          src={imgUrl}
          alt={poster.title}
          onError={() => setErr(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: poster.gradient,
            display: "flex",
            alignItems: "flex-end",
            padding: 10,
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.55)",
              borderRadius: 4,
              padding: "4px 8px",
              fontSize: 11,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.3,
              backdropFilter: "blur(4px)",
            }}
          >
            {poster.title}
          </div>
        </div>
      )}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: "#2d2d2d",
        borderBottom: "4px solid #000",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "22px 24px",
          fontSize: 18,
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
          gap: 12,
        }}
      >
        {q}{" "}
        <span
          style={{
            fontSize: 28,
            flexShrink: 0,
            transform: open ? "rotate(45deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          style={{
            background: "#3d3d3d",
            padding: "20px 24px",
            fontSize: 17,
            lineHeight: 1.7,
            color: "#e5e5e5",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function LandingPage({ onGetStarted }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [lang, setLang] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const [posterImages, setPosterImages] = useState({}); // tmdbId -> imgUrl
  const [animOffset, setAnimOffset] = useState(0);
  const animRef = useRef(null);
  const startRef = useRef(null);

  // Fetch real poster images for the collage
  useEffect(() => {
    async function fetchLandingPosters() {
      const imgs = {};
      // Fetch all movie posters using exact IDs
      await Promise.all(
        MOVIES.map(async (m) => {
          try {
            const type = m.tmdbType === "tv" ? "tv" : "movie";
            const res = await fetch(
              `https://api.themoviedb.org/3/${type}/${m.tmdbId}?api_key=${TMDB_API_KEY}`,
            );
            const data = await res.json();
            if (data.poster_path) {
              imgs[m.id] = TMDB_IMG + data.poster_path;
            }
          } catch {}
        }),
      );
      setPosterImages(imgs);
    }
    fetchLandingPosters();
  }, []);

  // Smooth scroll animation
  useEffect(() => {
    const speed = 0.25;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      setAnimOffset(
        ((ts - startRef.current) * speed) % (FALLBACK_POSTERS.length * 158),
      );
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleGetStarted = () => {
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    onGetStarted(email);
  };

  // Build poster list with real images mapped in order
  const movieIds = MOVIES.map((m) => m.id);
  const posterList = FALLBACK_POSTERS.map((p, i) => ({
    ...p,
    imgUrl: posterImages[movieIds[i % movieIds.length]] || null,
  }));

  // Split into 3 rows of 8
  const rows = [
    posterList.slice(0, 8),
    posterList.slice(8, 16),
    posterList.slice(16, 24),
  ];

  const CollageRow = ({ items, reverse }) => {
    const doubled = [...items, ...items, ...items];
    const offset = reverse ? animOffset : -animOffset;
    return (
      <div
        style={{
          display: "flex",
          gap: 8,
          transform: `translateX(${offset % (items.length * 158)}px)`,
          willChange: "transform",
        }}
      >
        {doubled.map((p, i) => (
          <PosterCard key={i} poster={p} imgUrl={p.imgUrl} />
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "white",
        fontFamily: "'Montserrat', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`@keyframes shimmer { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} }`}</style>

      {/* ── Animated Poster Collage Background ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          opacity: 0.72,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            position: "absolute",
            inset: -20,
            width: "calc(100% + 40px)",
          }}
        >
          {rows.map((row, i) => (
            <CollageRow key={i} items={row} reverse={i % 2 === 1} />
          ))}
          {/* extra row to fill bottom */}
          <CollageRow items={rows[0]} reverse={false} />
        </div>
      </div>

      {/* Dark overlays */}
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)" }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      {/* Red bottom line like Netflix */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(to right,#e50914,#b20710,#e50914)",
          zIndex: 5,
        }}
      />

      {/* ── Header ── */}
      <header
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 48px",
        }}
      >
        <NetflixLogo />
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: 4,
                color: "white",
                padding: "7px 14px",
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span>⊕</span> {lang} <span style={{ fontSize: 10 }}>▼</span>
            </button>
            {langOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 44,
                  background: "rgba(0,0,0,0.92)",
                  border: "1px solid #555",
                  borderRadius: 4,
                  overflow: "hidden",
                  zIndex: 100,
                  minWidth: 140,
                }}
              >
                {["English", "हिन्दी", "తెలుగు", "தமிழ்"].map((l) => (
                  <div
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    style={{
                      padding: "10px 16px",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#333")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {l}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onGetStarted(email)}
            style={{
              background: "#e50914",
              border: "none",
              borderRadius: 4,
              color: "white",
              padding: "8px 18px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f40612")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#e50914")}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* ── Hero CTA ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 140px)",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(34px,5vw,56px)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 16,
            maxWidth: 700,
            textShadow: "2px 2px 12px rgba(0,0,0,0.9)",
          }}
        >
          Unlimited movies, shows, and more
        </h1>
        <p
          style={{
            fontSize: "clamp(17px,2.5vw,24px)",
            fontWeight: 500,
            marginBottom: 8,
            textShadow: "1px 1px 6px rgba(0,0,0,0.9)",
          }}
        >
          Starts at ₹149. Cancel at any time.
        </p>
        <p
          style={{
            fontSize: 16,
            color: "#e5e5e5",
            marginBottom: 28,
            textShadow: "1px 1px 4px rgba(0,0,0,0.9)",
          }}
        >
          Ready to watch? Enter your email to get started.
        </p>
        <div
          style={{
            display: "flex",
            gap: 8,
            width: "100%",
            maxWidth: 620,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleGetStarted()}
              style={{
                width: "100%",
                padding: "18px 16px",
                fontSize: 16,
                background: "rgba(22,22,22,0.9)",
                border: emailError
                  ? "1px solid #e87c03"
                  : "1px solid rgba(255,255,255,0.4)",
                borderRadius: 4,
                color: "white",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            {emailError && (
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: "100%",
                  marginTop: 4,
                  fontSize: 12,
                  color: "#e87c03",
                }}
              >
                {emailError}
              </div>
            )}
          </div>
          <button
            onClick={handleGetStarted}
            style={{
              background: "#e50914",
              border: "none",
              borderRadius: 4,
              color: "white",
              padding: "18px 26px",
              fontSize: 20,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f40612")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#e50914")}
          >
            Get Started <span style={{ fontSize: 22 }}>›</span>
          </button>
        </div>
      </div>

      {/* ── Divider ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "8px solid #222",
        }}
      />

      {/* ── Features ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "rgba(0,0,0,0.9)",
          padding: "60px 48px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 24,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {[
            {
              icon: "📺",
              title: "Watch everywhere",
              desc: "Stream on phone, tablet, laptop and TV.",
            },
            {
              icon: "⬇️",
              title: "Download & watch offline",
              desc: "Save favourites and always have something to watch.",
            },
            {
              icon: "👶",
              title: "Kids profiles",
              desc: "A safe space made just for kids with their favourite characters.",
            },
            {
              icon: "🔥",
              title: "New shows weekly",
              desc: "Be first to watch the latest Netflix originals and exclusives.",
            },
          ].map((f, i) => (
            <div key={i} style={{ textAlign: "center", padding: "20px 12px" }}>
              <div style={{ fontSize: 42, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "#000",
          borderTop: "8px solid #222",
          padding: "60px 48px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 38,
            fontWeight: 900,
            marginBottom: 28,
          }}
        >
          Frequently Asked Questions
        </h2>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {[
            {
              q: "What is Netflix?",
              a: "Netflix is a streaming service offering award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
            },
            {
              q: "How much does Netflix cost?",
              a: "Plans range from ₹149 to ₹649 a month. No extra costs, no contracts.",
            },
            {
              q: "Where can I watch?",
              a: "Watch anywhere, anytime on your phone, tablet, laptop or TV.",
            },
            {
              q: "How do I cancel?",
              a: "Cancel online anytime in two clicks. No penalties, no commitments.",
            },
          ].map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontSize: 18, marginBottom: 20 }}>
            Ready to watch? Enter your email to get started.
          </p>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: "16px",
                fontSize: 16,
                background: "rgba(22,22,22,0.9)",
                border: "1px solid #555",
                borderRadius: 4,
                color: "white",
                outline: "none",
                width: 300,
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={handleGetStarted}
              style={{
                background: "#e50914",
                border: "none",
                borderRadius: 4,
                color: "white",
                padding: "16px 24px",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f40612")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#e50914")
              }
            >
              Get Started <span>›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          background: "#000",
          borderTop: "8px solid #222",
          padding: "40px 48px",
          color: "#737373",
        }}
      >
        <p style={{ marginBottom: 20, fontSize: 14 }}>
          Questions? Call 000-800-919-1694
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,auto)",
            gap: "10px 20px",
            marginBottom: 24,
            width: "fit-content",
          }}
        >
          {[
            "FAQ",
            "Help Center",
            "Account",
            "Media Centre",
            "Investor Relations",
            "Jobs",
            "Terms of Use",
            "Privacy",
            "Cookie Preferences",
            "Corporate Information",
            "Contact Us",
            "Only on Netflix",
          ].map((i) => (
            <span
              key={i}
              style={{
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {i}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 13 }}>
          Netflix India · © 2024 Netflix, Inc. (UI Clone — demo purposes only)
        </p>
      </footer>
    </div>
  );
}
