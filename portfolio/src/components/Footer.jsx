import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-cta">
          <h2>Let's work<br />together.</h2>
          <Link to="/contact" className="footer-cta-btn">Get in Touch →</Link>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/playground">Playground</Link>
            <Link to="/about">About</Link>
          </div>
          <div className="footer-col">
            <h4>Socials</h4>
            <a href="https://github.com/chinmayaranjanswain" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/chinmayaranjanswain" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/chinmaya_353" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:chinmayaranjanswain353@gmail.com">chinmayaranjanswain353@gmail.com</a>
            <p>Cuttack, India</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Chinmaya Swain. All rights reserved.</span>
        <span className="footer-time current-time"></span>
      </div>
    </footer>
  );
}
