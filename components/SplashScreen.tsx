'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [phase, setPhase] = useState<'hidden' | 'visible' | 'hiding'>('hidden');

  useEffect(() => {
    // Skip if already shown this session
    if (sessionStorage.getItem('wb_splash_shown')) return;
    sessionStorage.setItem('wb_splash_shown', '1');
    setPhase('visible');

    // No cleanup return — timers must run through even in React Strict Mode
    // (Strict Mode double-invokes effects but sessionStorage prevents double-trigger)
    setTimeout(() => setPhase('hiding'), 2400);
    setTimeout(() => setPhase('hidden'), 3100);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'hidden') return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-dark select-none transition-opacity duration-700 ${
        phase === 'hiding' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-800/20 rounded-full blur-3xl animate-pulse [animation-delay:400ms]" />

      {/* Animated W logo */}
      <div className="relative mb-8 splash-logo">
        <svg width="80" height="80" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="72" rx="20" fill="#1CD6CE" fillOpacity="0.12" />
          <rect width="72" height="72" rx="20" stroke="#1CD6CE" strokeWidth="1.5" strokeOpacity="0.35" />
          <polyline
            points="12,20 22,52 36,28 50,52 60,20"
            stroke="#1CD6CE"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="splash-path"
          />
        </svg>
      </div>

      {/* Brand name */}
      <div className="text-center splash-text">
        <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
          Widespread <span className="text-brand-teal">Blogs</span>
        </h1>
        <p className="text-white/40 text-xs font-semibold mt-3 tracking-[0.25em] uppercase">
          A Community Blogging Platform
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-10 w-36 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-brand-teal rounded-full splash-bar" />
      </div>
    </div>
  );
}
