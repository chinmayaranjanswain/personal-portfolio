import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from './Navbar';
import MenuOverlay from './MenuOverlay';
import BottomNav from './BottomNav';
import PageLoader from './PageLoader';
import ThreeBackground from './ThreeBackground';
import CustomCursor from './CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });
  const lenisRef = useRef(null);
  const location = useLocation();

  // Apply theme class
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.8,
      smoothTouch: false,
      touchMultiplier: 2,
      lerp: 0.08,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Scroll to top on route change & refresh ScrollTrigger
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    // Small delay so DOM is ready before ScrollTrigger re-scans
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // No longer need body.loaded — loader handles visibility via React state

  const toggleTheme = useCallback(() => {
    setIsLightMode((prev) => !prev);
  }, []);

  return (
    <>
      {!loaderDone && (
        <PageLoader onComplete={() => setLoaderDone(true)} />
      )}

      <div className="noise-overlay"></div>
      <div className="page-transition"></div>

      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isLightMode={isLightMode}
        toggleTheme={toggleTheme}
      />

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main>
        <Outlet context={{ isLightMode }} />
      </main>

      <BottomNav />

      <ThreeBackground isLightMode={isLightMode} />
      <CustomCursor />
    </>
  );
}
