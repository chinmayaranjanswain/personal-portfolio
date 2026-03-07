import React, { useEffect, useRef, useState } from 'react';

export default function PageLoader({ onComplete }) {
  const loaderRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [hiding, setHiding] = useState(false);

  // Wait for fonts to load
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
    // Fallback: if fonts don't load within 3s, proceed anyway
    const timeout = setTimeout(() => setFontsLoaded(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Counter animation: 0→100
  useEffect(() => {
    if (counter >= 100) return;
    const speed = counter < 70 ? 25 : counter < 90 ? 40 : 60;
    const timer = setTimeout(() => {
      setCounter((prev) => Math.min(prev + 1, 100));
    }, speed);
    return () => clearTimeout(timer);
  }, [counter]);

  // When counter hits 100 AND fonts are loaded, start exit animation
  useEffect(() => {
    if (counter >= 100 && fontsLoaded && !hiding) {
      setHiding(true);
      // Wait for CSS exit animation to finish
      setTimeout(() => {
        onComplete();
      }, 800);
    }
  }, [counter, fontsLoaded, hiding, onComplete]);

  if (!hiding && counter === 0 && fontsLoaded) {
    // Edge case: fonts loaded instantly, still show loader briefly
  }

  return (
    <div
      className={`page-loader ${hiding ? 'loader-exit' : ''}`}
      ref={loaderRef}
    >
      <div className="loader-brand">chinmaya.</div>
      <div className="loader-counter">{counter}</div>
      <div className="loader-bar-track">
        <div className="loader-bar-fill" style={{ width: `${counter}%` }} />
      </div>
    </div>
  );
}
