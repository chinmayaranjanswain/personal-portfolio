import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useProjectDetail } from '../hooks/useGithubApi';

const VIDEO_MAP = {
  'BOPIS---Buy-Online-Pick-Up-In-Store': '/assets/videos/BOPIS project.mp4',
  'Delay-Reverb-Time-Calculator': '/assets/videos/reverb calculater.mp4',
  'my-healer-': '/assets/videos/my healer.mp4',
  'chinmaya-watch-shop-e-commers': '/assets/videos/e-com watch shop.mp4',
  'login-info-in-phone': '/assets/videos/login-info-telegram.mp4',
};

export default function ProjectDetail() {
  const [searchParams] = useSearchParams();
  const repoName = searchParams.get('repo');
  const readableName = repoName ? repoName.replace(/-/g, ' ') : '';
  const { project, languages, readme, loading, error } = useProjectDetail(repoName);

  // Update page title
  useEffect(() => {
    if (readableName) {
      document.title = `Chinmaya | ${readableName}`;
    }
    return () => {
      document.title = 'Chinmaya Swain | Portfolio';
    };
  }, [readableName]);

  // Animate elements in once data is loaded
  useEffect(() => {
    if (loading || error) return;

    gsap.to('.pd-hero', { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 });
    gsap.to('.pd-showcase', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 });
    gsap.to('.pd-readme', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.0 });
  }, [loading, error]);

  if (error) {
    return (
      <section className="page-hero">
        <div className="page-hero-content">
          <h1>{error}</h1>
        </div>
      </section>
    );
  }

  const videoSrc = repoName ? VIDEO_MAP[repoName] : null;

  const formatReadme = (text) => {
    return text
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  };

  const created = project
    ? new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : '';
  const updated = project
    ? new Date(project.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : '';

  return (
    <>
      <div className="noise-overlay"></div>

      {/* Back link */}
      <div className="pd-back">
        <Link to="/projects" className="pd-back-link">← Back to Projects</Link>
      </div>

      {/* Hero */}
      <section className="pd-hero" id="pd-hero">
        <div className="pd-hero-meta">
          <span className="section-label">
            {loading ? 'LOADING...' : project?.language?.toUpperCase() || 'PROJECT'}
          </span>
          {!loading && <span className="pd-date">Created {created} • Updated {updated}</span>}
        </div>
        <h1>{loading ? 'Loading Project...' : readableName}</h1>
      </section>

      {/* Content */}
      <section className="pd-content">
        <div className="pd-showcase">
          <div className="pd-video-area">
            <div className="video-wrapper">
              {videoSrc ? (
                <video autoPlay muted loop playsInline>
                  <source src={videoSrc} type="video/mp4" />
                </video>
              ) : (
                <div className="video-placeholder">
                  <span className="play-icon">▶</span>
                  <span>PROJECT DEMO</span>
                </div>
              )}
            </div>
          </div>

          <div className="pd-info-side">
            <div className="pd-description">
              <h3>About This Project</h3>
              <p>{project?.description || 'No description available for this project.'}</p>
            </div>

            <div className="pd-meta-block">
              <h4>Tech Stack</h4>
              <div className="pd-tags">
                {Object.keys(languages).map((lang) => (
                  <span key={lang} className="pd-tag">{lang}</span>
                ))}
              </div>
            </div>

            <div className="pd-meta-block">
              <h4>Stats</h4>
              <div className="pd-stats">
                <div className="pd-stat">
                  <span className="pd-stat-num">{project?.stargazers_count || 0}</span>
                  <span className="pd-stat-label">Stars</span>
                </div>
                <div className="pd-stat">
                  <span className="pd-stat-num">{project?.forks_count || 0}</span>
                  <span className="pd-stat-label">Forks</span>
                </div>
                <div className="pd-stat">
                  <span className="pd-stat-num">{project?.size || 0}</span>
                  <span className="pd-stat-label">KB</span>
                </div>
              </div>
            </div>

            <div className="pd-meta-block">
              <h4>Links</h4>
              {project && (
                <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="pd-link-btn">
                  View on GitHub →
                </a>
              )}
              {project?.homepage && (
                <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="pd-link-btn pd-link-btn--live">
                  Live Demo →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* README Section */}
        {readme && (
          <div className="pd-readme">
            <h3>README</h3>
            <div
              className="pd-readme-content"
              dangerouslySetInnerHTML={{ __html: formatReadme(readme) }}
            />
          </div>
        )}
      </section>
    </>
  );
}
