"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Identifiants invalides");
        return;
      }
      // Use server-computed redirect (handles expired/suspended/super_admin)
      window.location.replace(data.redirect ?? "/dashboard");
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes gridMove {
          0%   { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        @keyframes float {
          0%   { transform: translateY(0) translateX(0);    opacity: 0; }
          20%  { opacity: 0.8; }
          100% { transform: translateY(-110vh) translateX(40px); opacity: 0; }
        }
        @keyframes roadMarks {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-80px); }
        }
        @keyframes shine {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes cardIn {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ae-grid-move   { animation: gridMove  18s linear infinite; }
        .ae-road-marks  { animation: roadMarks  1s linear infinite; }
        .ae-btn-shine   { animation: shine       3s ease-in-out infinite; }
        .ae-card-in     { animation: cardIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both; }
        .ae-p1 { animation: float  8s linear infinite  0s; }
        .ae-p2 { animation: float 10s linear infinite  2s; }
        .ae-p3 { animation: float  7s linear infinite  4s; }
        .ae-p4 { animation: float 12s linear infinite  1s; }
        .ae-p5 { animation: float  9s linear infinite  3s; }
        .ae-p6 { animation: float 11s linear infinite  5s; }
        .ae-input { transition: border-color 0.2s; }
        .ae-input:focus { border-color: rgba(34,197,94,0.5) !important; outline: none; }
        .ae-btn:active { transform: scale(0.97); }
      `}</style>

      <main
        style={{ backgroundColor: "#071a2e" }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 1 — Moving grid */}
        <div
          className="ae-grid-move absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(0deg,   transparent, transparent 39px, rgba(34,197,94,0.03) 39px, rgba(34,197,94,0.03) 40px)",
              "repeating-linear-gradient(90deg,  transparent, transparent 39px, rgba(34,197,94,0.03) 39px, rgba(34,197,94,0.03) 40px)",
            ].join(","),
          }}
        />

        {/* 2 — Radial glow left */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-100px",
            top: "20%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)",
          }}
        />

        {/* 3 — Radial glow right */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "-50px",
            bottom: "20%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
          }}
        />

        {/* 4 — Floating particles */}
        {(
          [
            { left: "10%",  cls: "ae-p1" },
            { left: "25%",  cls: "ae-p2" },
            { left: "50%",  cls: "ae-p3" },
            { left: "70%",  cls: "ae-p4" },
            { left: "85%",  cls: "ae-p5" },
            { left: "40%",  cls: "ae-p6" },
          ] as const
        ).map((p, i) => (
          <div
            key={i}
            className={`absolute pointer-events-none rounded-full ${p.cls}`}
            style={{
              left: p.left,
              bottom: 0,
              width: "3px",
              height: "3px",
              backgroundColor: "rgba(34,197,94,0.6)",
            }}
          />
        ))}

        {/* 5 — Road */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
          style={{ height: "72px", background: "rgba(0,0,0,0.45)" }}
        >
          <div className="absolute inset-0 flex items-center overflow-hidden">
            <div className="ae-road-marks flex" style={{ gap: "24px", flexShrink: 0 }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "56px",
                    height: "4px",
                    backgroundColor: "rgba(255,255,255,0.18)",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 6 — Car */}
        <div
          className="absolute pointer-events-none"
          style={{ bottom: "22px", left: "14%", transform: "scaleX(-1)" }}
        >
          {/* Headlight beam */}
          <div
            style={{
              position: "absolute",
              right: "-64px",
              top: "6px",
              width: "90px",
              height: "22px",
              background:
                "linear-gradient(to right, rgba(34,197,94,0.25), transparent)",
              clipPath: "polygon(0 40%, 100% 0%, 100% 100%, 0 60%)",
            }}
          />
          <svg width="84" height="42" viewBox="0 0 84 42" fill="none">
            {/* Body */}
            <rect x="8"  y="20" width="66" height="16" rx="3" fill="#132d20" />
            {/* Cab */}
            <rect x="20" y="11" width="38" height="13" rx="2" fill="#132d20" />
            {/* Windows */}
            <rect x="22" y="12" width="17" height="10" rx="1" fill="rgba(34,197,94,0.18)" />
            <rect x="41" y="12" width="14" height="10" rx="1" fill="rgba(34,197,94,0.12)" />
            {/* Wheels */}
            <circle cx="22" cy="36" r="6" fill="#0a1f13" stroke="#22c55e" strokeWidth="1.2" />
            <circle cx="22" cy="36" r="2.5" fill="#22c55e" />
            <circle cx="62" cy="36" r="6" fill="#0a1f13" stroke="#22c55e" strokeWidth="1.2" />
            <circle cx="62" cy="36" r="2.5" fill="#22c55e" />
            {/* Headlight */}
            <rect x="6"  y="22" width="5" height="5" rx="1" fill="rgba(34,197,94,0.7)" />
            {/* Tail light */}
            <rect x="73" y="22" width="4" height="5" rx="1" fill="rgba(239,68,68,0.5)" />
          </svg>
        </div>

        {/* 7 — Glass card */}
        <div
          className="ae-card-in relative z-10"
          style={{
            width: "380px",
            maxWidth: "calc(100vw - 32px)",
            backgroundColor: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* Inline car icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h13l4 4v4a2 2 0 01-2 2h-1" />
                <circle cx="7.5" cy="17" r="2.5" />
                <circle cx="17.5" cy="17" r="2.5" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>
                Auto-École Manager
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginTop: "3px" }}>
                Plateforme de gestion professionnelle
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 6px" }}>
            Bienvenue
          </h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", margin: "0 0 24px" }}>
            Connectez-vous à votre espace de gestion
          </p>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.22)",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: "13px", color: "#ef4444" }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: "6px",
                }}
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.ma"
                required
                autoComplete="email"
                className="ae-input"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "13px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: "6px",
                }}
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="ae-input"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "13px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Remember + forgot */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: "#22c55e", width: "13px", height: "13px" }}
                />
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
                  Se souvenir de moi
                </span>
              </label>
              <button
                type="button"
                style={{
                  fontSize: "12px",
                  color: "rgba(34,197,94,0.75)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="ae-btn"
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                padding: "12px",
                marginTop: "4px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#ffffff",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s, transform 0.1s",
              }}
            >
              {!loading && (
                <span
                  className="ae-btn-shine"
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "60%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                    pointerEvents: "none",
                  }}
                />
              )}
              <span style={{ position: "relative" }}>
                {loading ? "Connexion en cours…" : "Se connecter"}
              </span>
            </button>
          </form>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {(
              [
                { value: "200+", label: "Auto-écoles" },
                { value: "12k+", label: "Élèves" },
                { value: "98%",  label: "Satisfaction" },
              ] as const
            ).map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#22c55e" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", marginTop: "3px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
