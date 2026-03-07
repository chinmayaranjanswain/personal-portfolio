import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Contact() {
  const heroRef = useRef(null);

  useEffect(() => {
    const heroText = heroRef.current?.querySelectorAll('.reveal-text h1');
    if (!heroText || heroText.length === 0) return;

    document.fonts.ready.then(() => {
      gsap.fromTo(
        heroText,
        { y: 100, opacity: 0, willChange: 'transform' },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
          force3D: true,
          clearProps: 'willChange',
        }
      );
    });

    const contentSections = document.querySelectorAll('.contact-content');
    if (contentSections.length > 0) {
      gsap.to(contentSections, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8,
      });
    }
  }, []);

  return (
    <>
      <div className="noise-overlay"></div>

      <section className="page-hero" ref={heroRef}>
        <div className="page-hero-content">
          <div className="reveal-text">
            <h1>GET IN</h1>
          </div>
          <div className="reveal-text">
            <h1>TOUCH.</h1>
          </div>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-grid">
          <div className="contact-col">
            <span className="section-label">EMAIL</span>
            <a href="mailto:chinmayaranjanswain353@gmail.com" className="contact-link-big">
              chinmayaranjanswain353<br />@gmail.com
            </a>
          </div>

          <div className="contact-col">
            <span className="section-label">SOCIALS</span>
            <div className="contact-socials">
              <a href="https://www.linkedin.com/in/chinmayaranjanswain" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn ↗</a>
              <a href="https://github.com/chinmayaranjanswain" target="_blank" rel="noopener noreferrer" className="social-link">GitHub ↗</a>
              <a href="https://www.instagram.com/chinmaya_353" target="_blank" rel="noopener noreferrer" className="social-link">Instagram ↗</a>
            </div>
          </div>

          <div className="contact-col">
            <span className="section-label">LOCATION</span>
            <p className="contact-detail">Cuttack, Odisha<br />India</p>
          </div>
        </div>

        <div className="contact-cta">
          <p>Have a project in mind? Let's build something extraordinary together.</p>
        </div>
      </section>
    </>
  );
}
