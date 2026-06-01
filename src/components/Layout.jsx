import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import MenuOverlay from './MenuOverlay';
import BottomNav from './BottomNav';
import PageLoader from './PageLoader';

import CustomCursor from './CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });
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

  // Scroll to top on route change & refresh ScrollTrigger
  useEffect(() => {
    window.scrollTo(0, 0);

    // Small delay so DOM is ready before ScrollTrigger re-scans
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

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
        <Outlet context={{ isLightMode, loaderDone }} />
      </main>

      <BottomNav />


      <CustomCursor />
    </>
  );
}
