import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ menuOpen, setMenuOpen, isLightMode, toggleTheme }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(now.toLocaleString('en-IN', options));
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">chinmaya.</Link>
        <span className="current-time">{currentTime}</span>
      </div>

      <div className="nav-right-controls">
        <button
          className="theme-toggle"
          id="theme-toggle"
          aria-label="Toggle Theme"
          onClick={toggleTheme}
        >
          <span className="theme-icon">{isLightMode ? '☀️' : '🌙'}</span>
          <span className="theme-label">{isLightMode ? 'Light' : 'Dark'}</span>
        </button>

        <button
          className={`menu-toggle ${menuOpen ? 'is-active' : ''}`}
          aria-label="Toggle Menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          onMouseEnter={() => setMenuOpen(true)}
        >
          <div className="hamburger-box">
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </div>
        </button>
      </div>
    </nav>
  );
}
