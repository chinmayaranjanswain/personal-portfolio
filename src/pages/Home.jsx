import React, { useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  useGithubStats,
  useGithubRepos,
  useGithubContributions,
} from '../hooks/useGithubApi';
import { useYoutubeStats } from '../hooks/useYoutubeApi';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

// Gallery items (simplified — no glow configs needed)
const GALLERY_ITEMS = [
  { src: '/assets/photos/replace the music pic.webp', alt: 'Code & Coffee', caption: 'nature' },
  { src: '/assets/photos/replace the neture pic.png', alt: 'Late Night Builds', caption: 'Late Night travels' },
  { src: '/assets/photos/retouch_2025010110364641.webp', alt: 'Hackathon Vibes', caption: 'enjoyy Vibes' },
  { src: '/assets/photos/retouch_2024113010444844.webp', alt: 'Design Process', caption: 'counting stars' },
  { src: '/assets/photos/retouch_2024122017045988.webp', alt: 'Team Work', caption: 'rivers' },
  { src: '/assets/photos/retouch_2024112713071997.webp', alt: 'Open Source', caption: 'Open Source' },
];

export default function Home() {
  const { loaderDone } = useOutletContext();
  const heroRef = useRef(null);
  const contribBoardRef = useRef(null);
  const stats = useGithubStats();
  const repos = useGithubRepos();
  const contributions = useGithubContributions();
  const ytStats = useYoutubeStats();

  // Hero text — clean line reveal after loader
  useEffect(() => {
    if (!loaderDone) return;

    const heroEl = heroRef.current;
    if (!heroEl) return;

    const heroContent = heroEl.querySelector('.hero-content--centered');
    const lines = heroEl.querySelectorAll('.hero-line-inner');
    if (lines.length === 0) return;

    // Make container visible
    if (heroContent) heroContent.style.visibility = 'visible';

    // Lines start pushed down behind mask
    gsap.set(lines, { y: '110%' });

    // Resume btn starts invisible
    const resumeBtn = heroEl.querySelector('.hero-resume-btn');
    if (resumeBtn) gsap.set(resumeBtn, { opacity: 0, y: 20 });

    document.fonts.ready.then(() => {
      const tl = gsap.timeline();

      tl.to(lines, {
        y: '0%',
        duration: 1.4,
        stagger: 0.15,
        ease: 'expo.out',
        delay: 0.05,
      });

      // Resume btn fades in after text
      if (resumeBtn) {
        tl.to(resumeBtn, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.6');
      }
    });

    return () => {
      lines.forEach((l) => gsap.killTweensOf(l));
    };
  }, [loaderDone]);

  // Scroll-triggered section animations
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const timer = setTimeout(() => {

      // Section fade-in with smooth slide
      const sections = document.querySelectorAll(
        '.showreel-section, .github-section, .youtube-section, .recent-projects-section, .gallery-section, .site-footer'
      );
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { y: isMobile ? 40 : 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.8 : 1.2,
            ease: 'expo.out',
            force3D: true,
            clearProps: 'will-change',
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'top 50%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Section headings — parallax float (skip on mobile — scrub is expensive)
      if (!isMobile) {
        const headings = document.querySelectorAll(
          '.showreel-text h2, .github-header h2, .youtube-header h2, .recent-header h2, .gallery-header h2, .footer-cta h2'
        );
        headings.forEach((heading) => {
          gsap.fromTo(
            heading,
            { y: 40 },
            {
              y: -20,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: heading,
                start: 'top 95%',
                end: 'top 20%',
                scrub: 1.5,
              },
            }
          );
        });
      }

      // Gallery items — simple fade-in (no scale to avoid heavy repaints)
      const galleryItems = document.querySelectorAll('.gallery-item');
      if (galleryItems.length > 0) {
        gsap.fromTo(
          galleryItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: isMobile ? 0.04 : 0.08,
            ease: 'power2.out',
            force3D: true,
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
          { x: isMobile ? -20 : -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: isMobile ? 0.5 : 0.8,
            stagger: isMobile ? 0.06 : 0.1,
            ease: 'power4.out',
            force3D: true,
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
            force3D: true,
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
              duration: isMobile ? 1.2 : 2,
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

  // Contribution board animation — skip heavy stagger on mobile
  useEffect(() => {
    const board = contribBoardRef.current;
    if (!board) return;
    const cells = board.querySelectorAll('.contrib-cell');
    if (cells.length === 0) return;

    const isMobile = window.innerWidth <= 768;

    // On mobile, just show cells without animation (364 scale animations = jank)
    if (isMobile) {
      gsap.set(cells, { scale: 1 });
      return;
    }

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
      <section className="hero-section hero-section--centered" ref={heroRef}>
        <div className="hero-content hero-content--centered">
          <div className="hero-name-line">
            <h1 className="hero-line-inner">CHINMAYA</h1>
          </div>
          <div className="hero-name-line">
            <h1 className="hero-line-inner">SWAIN.</h1>
          </div>
          <a
            href="/assets/chinmaya_swain.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-resume-btn"
          >
            RESUME
          </a>
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
          <div className="video-wrapper">
            <video autoPlay muted loop playsInline>
              <source src="/assets/videos/match-cut.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* GITHUB CONTRIBUTIONS */}
      <section className="github-section">
        <div className="github-header">
          <span className="section-label">OPEN SOURCE</span>
          <h2>Contributions</h2>
        </div>

        <div className="github-profile-card">
          <img src="https://avatars.githubusercontent.com/u/187296043?v=4" alt="Chinmaya" className="gh-avatar" />
          <div className="gh-profile-info">
            <h3>Chinmaya Ranjan Swain</h3>
            <a href="https://github.com/chinmayaranjanswain" target="_blank" rel="noopener noreferrer" className="github-username">
              @chinmayaranjanswain
            </a>
            <p className="gh-location">📍 Cuttack, Odisha</p>
          </div>
        </div>

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

      {/* YOUTUBE CHANNEL */}
      <section className="youtube-section">
        <div className="youtube-header">
          <span className="section-label">YOUTUBE</span>
          <h2>Channel</h2>
        </div>

        <a
          href={ytStats.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="youtube-profile-card"
        >
          <div className="yt-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <div className="yt-profile-info">
            <h3>{ytStats.channelName}</h3>
            <span className="yt-handle">{ytStats.handle}</span>
          </div>
          <span className="yt-visit-arrow">→</span>
        </a>

        <div className="youtube-stats">
          <div className="stat">
            <span className="stat-num">{ytStats.subscribers}</span>
            <span className="stat-label">Subscribers</span>
          </div>
          <div className="stat">
            <span className="stat-num">{ytStats.views}</span>
            <span className="stat-label">Total Views</span>
          </div>
          <div className="stat">
            <span className="stat-num">{ytStats.videos}</span>
            <span className="stat-label">Videos</span>
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
            <div key={i} className="gallery-item">
              <div className="gallery-img">
                <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              </div>
              <span className="gallery-caption">{item.caption}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
