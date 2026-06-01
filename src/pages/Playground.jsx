import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Playground() {
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

    const contentSections = document.querySelectorAll('.playground-container');
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

  const experiments = [
    { num: '01', title: 'Three.js Liquid', desc: 'Shader experiment with fluid simulation and real-time deformation.', tag: 'WebGL' },
    { num: '02', title: 'Particle System', desc: 'GPU-accelerated particle engine with attraction and repulsion forces.', tag: 'Three.js' },
    { num: '03', title: 'Audio Visualizer', desc: 'Real-time frequency analysis driving procedural geometry.', tag: 'Web Audio API' },
    { num: '04', title: 'CSS Art Engine', desc: 'Generative art compositions using pure CSS and custom properties.', tag: 'CSS' },
  ];

  return (
    <>
      <div className="noise-overlay"></div>

      <section className="page-hero" ref={heroRef}>
        <div className="page-hero-content">
          <div className="reveal-text">
            <h1>LAB /</h1>
          </div>
          <div className="reveal-text">
            <h1>EXPERIMENTS.</h1>
          </div>
        </div>
        <p className="page-subtitle">Code sketches, shaders, and broken things.</p>
      </section>

      <section className="playground-container">
        <div className="playground-grid">
          {experiments.map((exp) => (
            <article key={exp.num} className="lab-item">
              <div className="lab-num">{exp.num}</div>
              <h3>{exp.title}</h3>
              <p>{exp.desc}</p>
              <span className="lab-tag">{exp.tag}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
