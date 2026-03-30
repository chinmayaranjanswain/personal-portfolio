import React, { useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  useGithubStats,
  useGithubRepos,
  useGithubContributions,
} from '../hooks/useGithubApi';
import Footer from '../components/Footer';
import BorderGlow from '../components/BorderGlow';
import ThreeBackground from '../components/ThreeBackground';
import BackgroundPaths from '../components/BackgroundPaths';

gsap.registerPlugin(ScrollTrigger);

// Gallery items with per-image glow color configs
const GALLERY_ITEMS = [
  { src: '/assets/photos/replace the music pic.webp', alt: 'Code & Coffee', caption: 'nature', color: '#6366f1', glowHsl: '239 70 65', glowColors: ['#6366f1', '#818cf8', '#a78bfa'] },
  { src: '/assets/photos/replace the neture pic.png', alt: 'Late Night Builds', caption: 'Late Night travels', color: '#ec4899', glowHsl: '330 80 60', glowColors: ['#ec4899', '#f472b6', '#fb7185'] },
  { src: '/assets/photos/retouch_2025010110364641.webp', alt: 'Hackathon Vibes', caption: 'enjoyy Vibes', color: '#14b8a6', glowHsl: '173 70 55', glowColors: ['#14b8a6', '#2dd4bf', '#38f9d7'] },
  { src: '/assets/photos/retouch_2024113010444844.webp', alt: 'Design Process', caption: 'counting stars', color: '#f59e0b', glowHsl: '38 90 55', glowColors: ['#f59e0b', '#fbbf24', '#fcd34d'] },
  { src: '/assets/photos/retouch_2024122017045988.webp', alt: 'Team Work', caption: 'rivers', color: '#8b5cf6', glowHsl: '258 70 65', glowColors: ['#8b5cf6', '#a78bfa', '#c4b5fd'] },
  { src: '/assets/photos/retouch_2024112713071997.webp', alt: 'Open Source', caption: 'Open Source', color: '#10b981', glowHsl: '160 75 50', glowColors: ['#10b981', '#34d399', '#6ee7b7'] },
];

export default function Home() {
  const { loaderDone } = useOutletContext();
  const heroRef = useRef(null);
  const contribBoardRef = useRef(null);
  const stats = useGithubStats();
  const repos = useGithubRepos();
  const contributions = useGithubContributions();

  // Hero text animation — runs after loader completes
  useEffect(() => {
    const heroText = heroRef.current?.querySelectorAll('.reveal-text h1');
    if (!heroText || heroText.length === 0) return;

    // Set initial state explicitly (override CSS translateY(100%))
    gsap.set(heroText, { y: '100%', opacity: 0 });

    document.fonts.ready.then(() => {
      gsap.to(heroText, {
        y: '0%',
        opacity: 1,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
        force3D: true,
      });
    });
  }, []);

  // Scroll-triggered section animations
  useEffect(() => {
    const timer = setTimeout(() => {

      // Section fade-in with smooth slide
      const sections = document.querySelectorAll(
        '.showreel-section, .github-section, .recent-projects-section, .gallery-section, .site-footer'
      );
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'top 50%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Section headings — parallax float
      const headings = document.querySelectorAll(
        '.showreel-text h2, .github-header h2, .recent-header h2, .gallery-header h2, .footer-cta h2'
      );
      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          { y: 40 },
          {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: heading,
              start: 'top 95%',
              end: 'top 20%',
              scrub: 1.5,
            },
          }
        );
      });

      // Gallery items — stagger scale-in
      const galleryItems = document.querySelectorAll('.gallery-item');
      if (galleryItems.length > 0) {
        gsap.fromTo(
          galleryItems,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: '.gallery-grid',
              start: 'top 85%',
            },
          }
        );
      }

      // Recent projects — stagger slide-in
      const recentProjects = document.querySelectorAll('.recent-project');
      if (recentProjects.length > 0) {
        gsap.fromTo(
          recentProjects,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: '.recent-projects-grid',
              start: 'top 85%',
            },
          }
        );
      }

      // GitHub profile card — gentle pop-in
      const profileCard = document.querySelector('.github-profile-card');
      if (profileCard) {
        gsap.fromTo(
          profileCard,
          { y: 30, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: profileCard,
              start: 'top 85%',
            },
          }
        );
      }

      // Stats counter animation
      const statNums = document.querySelectorAll('.stat-num');
      statNums.forEach((el) => {
        const target = parseInt(el.textContent);
        if (isNaN(target)) return;
        el.textContent = '0';

        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(el, {
              duration: 2,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = Math.round(target * this.progress());
              },
            });
          },
          once: true,
        });
      });

      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [stats, repos]);

  // Contribution board animation
  useEffect(() => {
    const board = contribBoardRef.current;
    if (!board) return;
    const cells = board.querySelectorAll('.contrib-cell');
    if (cells.length === 0) return;

    const timer = setTimeout(() => {
      gsap.fromTo(
        cells,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.3,
          stagger: { each: 0.003, from: 'start' },
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: board,
            start: 'top 80%',
          },
        }
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [contributions]);

  // Generate 364-day contribution grid
  const contribCells = [];
  const today = new Date();
  for (let i = 363; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = contributions[dateStr] || 0;
    let level;
    if (count === 0) level = 0;
    else if (count <= 2) level = 1;
    else if (count <= 4) level = 2;
    else if (count <= 7) level = 3;
    else level = 4;

    contribCells.push(
      <div
        key={dateStr}
        className={`contrib-cell contrib-${level}`}
        title={`${dateStr}: ${count} contribution${count !== 1 ? 's' : ''}`}
      />
    );
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section" ref={heroRef}>
        <BackgroundPaths />
        <ThreeBackground loaderDone={loaderDone} />
        <div className="hero-content">
          <div className="reveal-text">
            <h1>CHINMAYA</h1>
          </div>
          <div className="reveal-text">
            <h1>SWAIN.</h1>
          </div>
        </div>
      </section>

      {/* VIDEO SHOWREEL */}
      <section className="showreel-section">
        <div className="showreel-text">
          <span className="section-label">SHOWREEL / 2026</span>
          <h2>Building systems<br />that feel alive.</h2>
          <p>Full-stack developer & creative technologist crafting digital experiences at the intersection of design and engineering.</p>
        </div>
        <div className="showreel-video">
          <BorderGlow
            edgeSensitivity={8}
            glowColor="175 85 55"
            backgroundColor="#0a0a0a"
            borderRadius={12}
            glowRadius={35}
            glowIntensity={0.9}
            coneSpread={25}
            colors={['#38f9d7', '#43e97b', '#38bdf8']}
            fillOpacity={0.4}
          >
            <div className="video-wrapper video-wrapper--glowed">
              <video autoPlay muted loop playsInline>
                <source src="/assets/videos/match-cut.mp4" type="video/mp4" />
              </video>
            </div>
          </BorderGlow>
        </div>
      </section>

      {/* GITHUB CONTRIBUTIONS */}
      <section className="github-section">
        <div className="github-header">
          <span className="section-label">OPEN SOURCE</span>
          <h2>Contributions</h2>
        </div>

        <BorderGlow
          edgeSensitivity={10}
          glowColor="170 90 65"
          backgroundColor="rgba(255,255,255,0.03)"
          borderRadius={12}
          glowRadius={30}
          glowIntensity={0.85}
          coneSpread={22}
          colors={['#38f9d7', '#667eea', '#764ba2']}
          fillOpacity={0.35}
          className="github-profile-glow"
        >
          <div className="github-profile-card github-profile-card--glowed">
            <img src="https://avatars.githubusercontent.com/u/187296043?v=4" alt="Chinmaya" className="gh-avatar" />
            <div className="gh-profile-info">
              <h3>Chinmaya Ranjan Swain</h3>
              <a href="https://github.com/chinmayaranjanswain" target="_blank" rel="noopener noreferrer" className="github-username">
                @chinmayaranjanswain
              </a>
              <p className="gh-location">📍 Cuttack, Odisha</p>
            </div>
          </div>
        </BorderGlow>

        <div className="contribution-board" id="contribution-board" ref={contribBoardRef}>
          {contribCells}
        </div>

        <div className="github-stats" id="github-stats">
          <div className="stat">
            <span className="stat-num" id="stat-repos">{stats.repos}</span>
            <span className="stat-label">Repositories</span>
          </div>
          <div className="stat">
            <span className="stat-num" id="stat-followers">{stats.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat-num" id="stat-following">{stats.following}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </section>

      {/* RECENT PROJECTS */}
      <section className="recent-projects-section">
        <div className="recent-header">
          <span className="section-label">CURRENTLY BUILDING</span>
          <h2>Recent Work</h2>
        </div>
        <div className="recent-projects-grid" id="recent-projects-grid">
          {repos.map((repo, i) => (
            <Link key={repo.id} to={`/project-detail?repo=${repo.name}`} className="recent-project">
              <span className="rp-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="rp-info">
                <h3>{repo.name.replace(/-/g, ' ')}</h3>
                <p>
                  {repo.language || 'Misc'} •{' '}
                  {repo.description
                    ? repo.description.length > 60
                      ? repo.description.slice(0, 60) + '…'
                      : repo.description
                    : 'No description'}
                </p>
              </div>
              <span className="rp-arrow">→</span>
            </Link>
          ))}
        </div>
        <a
          href="https://github.com/chinmayaranjanswain?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="view-all-link"
        >
          View All on GitHub →
        </a>
      </section>

      {/* GALLERY */}
      <section className="gallery-section">
        <div className="gallery-header">
          <span className="section-label">MOMENTS</span>
          <h2>Gallery</h2>
        </div>
        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item, i) => (
            <div key={i} className="gallery-item" data-color={item.color}>
              <BorderGlow
                edgeSensitivity={12}
                glowColor={item.glowHsl}
                backgroundColor="#0a0a0a"
                borderRadius={8}
                glowRadius={25}
                glowIntensity={0.8}
                coneSpread={20}
                colors={item.glowColors}
                fillOpacity={0.3}
              >
                <div className="gallery-img gallery-img--glowed">
                  <img src={item.src} alt={item.alt} />
                </div>
              </BorderGlow>
              <span className="gallery-caption">{item.caption}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
