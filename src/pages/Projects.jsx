import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import BorderGlow from '../components/BorderGlow';

export default function Projects() {
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

    const contentSections = document.querySelectorAll('.projects-container');
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

  const projects = [
    {
      repo: 'BOPIS---Buy-Online-Pick-Up-In-Store',
      meta: '01 / MERN STACK',
      video: '/assets/videos/BOPIS project.mp4',
      title: ['BOPIS', 'Buy Online, Pick In-Store'],
      desc: 'Full-stack logistics optimization platform with real-time queue management, inventory tracking, and smart delivery routing.',
    },
    {
      repo: 'Delay-Reverb-Time-Calculator',
      meta: '02 / PYTHON APP',
      video: '/assets/videos/reverb calculater.mp4',
      title: ['Delay & Reverb', 'Calculator'],
      desc: 'Desktop application for audio engineers — calculates precise delay times and reverb parameters synced to BPM.',
    },
    {
      repo: 'Clean-My-Mess',
      meta: '03 / PYTHON',
      video: null,
      title: ['Clean My', 'Mess'],
      desc: 'Automated file organizer that sorts all files and folders, clearing the clutter and separating by type.',
    },
    {
      repo: 'login-info-in-phone',
      meta: '04 / PYTHON • TELEGRAM',
      video: '/assets/videos/login-info-telegram.mp4',
      title: ['Login Info', 'In Phone'],
      desc: 'Security tool that sends login details (IP, time, hostname) to Telegram for owner verification.',
    },
    {
      repo: 'my-healer-',
      meta: '05 / JAVASCRIPT',
      video: '/assets/videos/my healer.mp4',
      title: ['My', 'Healer'],
      desc: 'Web application built with JavaScript and deployed on Vercel.',
    },
    {
      repo: 'chinmaya-watch-shop-e-commers',
      meta: '06 / CSS • E-COMMERCE',
      video: '/assets/videos/e-com watch shop.mp4',
      title: ['Watch Shop', 'E-Commerce'],
      desc: 'A stylish e-commerce watch shop interface with a modern design.',
    },
  ];

  return (
    <>
      <div className="noise-overlay"></div>

      <section className="page-hero" ref={heroRef}>
        <div className="page-hero-content">
          <div className="reveal-text">
            <h1>SELECTED</h1>
          </div>
          <div className="reveal-text">
            <h1>WORKS.</h1>
          </div>
        </div>
      </section>

      <section className="projects-container">
        {projects.map((project) => (
          <Link
            key={project.repo}
            to={`/project-detail?repo=${project.repo}`}
            className="project-item-link"
          >
            <BorderGlow
              edgeSensitivity={15}
              glowColor="175 85 55"
              backgroundColor="transparent"
              borderRadius={0}
              glowRadius={25}
              glowIntensity={0.7}
              coneSpread={30}
              colors={['#38f9d7', '#43e97b', '#38bdf8']}
              fillOpacity={0.25}
              className="project-item-glow"
            >
              <article className="project-item project-item--glowed">
                <span className="meta">{project.meta}</span>
                <div className="project-preview">
                  {project.video ? (
                    <video src={project.video} autoPlay muted loop playsInline></video>
                  ) : (
                    <div className="project-preview-placeholder">
                      <span>▶</span>
                    </div>
                  )}
                </div>
                <div className="project-info">
                  <h2>{project.title[0]}<br />{project.title[1]}</h2>
                  <p>{project.desc}</p>
                </div>
                <span className="project-arrow">→</span>
              </article>
            </BorderGlow>
          </Link>
        ))}
      </section>
    </>
  );
}
