import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function MenuOverlay({ open, onClose }) {
  const overlayRef = useRef(null);
  const linksRef = useRef([]);
  const infoRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    tl.to(overlayRef.current, {
      y: 0,
      duration: 0.6,
      ease: 'power4.inOut',
    }).to(
      [...linksRef.current, infoRef.current],
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.4,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (open) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
  }, [open]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div
      className="menu-overlay"
      ref={overlayRef}
      onMouseLeave={onClose}
    >
      <div className="menu-links">
        {[
          { to: '/projects', num: '01', label: 'Projects' },
          { to: '/playground', num: '02', label: 'Playground' },
          { to: '/about', num: '03', label: 'About' },
          { to: '/contact', num: '04', label: 'Contact' },
        ].map((item, i) => (
          <Link
            key={item.to}
            to={item.to}
            className="menu-item"
            ref={(el) => (linksRef.current[i] = el)}
            onClick={handleLinkClick}
          >
            <span className="menu-num">{item.num}</span> {item.label}
          </Link>
        ))}
        <a
          href="/assets/chinmaya_swain.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-item"
          ref={(el) => (linksRef.current[4] = el)}
        >
          <span className="menu-num">05</span> CV
        </a>
      </div>
      <div className="menu-info" ref={infoRef}>
        <h3>Connect</h3>
        <a href="https://www.linkedin.com/in/chinmayaranjanswain" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/chinmayaranjanswain" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.instagram.com/chinmaya_353" target="_blank" rel="noopener noreferrer">Instagram</a>
        <div className="menu-email">
          <h3>Say Hello</h3>
          <p>chinmayaranjanswain353@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
