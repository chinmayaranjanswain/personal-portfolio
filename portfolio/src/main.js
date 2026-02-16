import './scss/main.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/* =========================================
   1. GSAP & LENIS SETUP
   ========================================= */
gsap.registerPlugin(ScrollTrigger);
import * as THREE from 'three';
/* =========================================
   5. THREE.JS BACKGROUND (Desktop Only)
   ========================================= */

// Define what "Mobile" means (e.g., screens smaller than 768px)
const isMobile = window.innerWidth < 768;

// ONLY run this if NOT mobile
if (!isMobile) {
  try {
    const canvas = document.querySelector('#webgl-canvas');
    if (canvas) {



      // 1. Scene Setup
      const canvas = document.querySelector('#webgl-canvas');
      const scene = new THREE.Scene();

      // 2. Geometry: A complex Torus Knot
      // (radius, tube, tubularSegments, radialSegments, p, q)
      const geometry = new THREE.TorusKnotGeometry(10, 3, 200, 32);

      // 3. Material Layer 1: The White Glowing Wireframe
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });

      // 4. Material Layer 2: The "Realistic" Volume (Ghost layer)
      const volumeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        transmission: 0.9,
        thickness: 1,
        roughness: 0.1
      });

      // Create the meshes
      const wireframeMesh = new THREE.Mesh(geometry, wireMaterial);
      const volumeMesh = new THREE.Mesh(geometry, volumeMaterial);

      // Group them so they move together
      const abstractObject = new THREE.Group();
      abstractObject.add(wireframeMesh);
      abstractObject.add(volumeMesh);
      abstractObject.position.x = 25; // Right side so text is visible
      scene.add(abstractObject);

      // 5. Lighting (Gives the volume layer its "realistic" sheen)
      const light = new THREE.PointLight(0xffffff, 50, 100);
      light.position.set(20, 10, 20);
      scene.add(light);

      // 6. Camera & Renderer Setup
      const sizes = { width: window.innerWidth, height: window.innerHeight };
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
      camera.position.z = 30;





      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true, // Keep true for desktop
        powerPreference: "high-performance" // Tells browser to prioritize FPS
      });
      renderer.setSize(sizes.width, sizes.height);
      // CRITICAL LINE:
      // This prevents 4k rendering on phones. 2x looks perfect, 3x is waste.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


      /* =========================================
         7. CURSOR TRACKING + AUTONOMOUS ANIMATION
         ========================================= */
      const clock = new THREE.Clock();

      // Mouse position in 3D-friendly coordinates (-1 to 1 range)
      const mouse = { x: 0, y: 0 };
      // Smoothed position (what the object actually follows)
      const smoothMouse = { x: 0, y: 0 };

      document.addEventListener('mousemove', (e) => {
        // Normalize to -1 … +1
        mouse.x = (e.clientX / sizes.width) * 2 - 1;
        mouse.y = -(e.clientY / sizes.height) * 2 + 1;
      });

      // Simple lerp helper
      function lerp(start, end, factor) {
        return start + (end - start) * factor;
      }

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Smoothly interpolate toward the mouse (lower = slower/smoother)
        smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.03);
        smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.03);

        // Base position (right side) + cursor influence (object drifts toward mouse)
        abstractObject.position.x = 25 + smoothMouse.x * 5;
        abstractObject.position.y = Math.sin(elapsedTime * 0.15) * 1.0 + smoothMouse.y * 3;

        // Very slow, elegant rotation
        abstractObject.rotation.y = elapsedTime * 0.04;
        abstractObject.rotation.x = elapsedTime * 0.05;
        abstractObject.rotation.z = Math.sin(elapsedTime * 0.08) * 0.05;

        // Gentle "Breathing" scale
        const scale = 1 + Math.sin(elapsedTime * 0.2) * 0.02;
        abstractObject.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
      };

      tick();

      // Resize Handler
      window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
      });


      console.log("Desktop detected: 3D Scene Initialized");
    }
  } catch (error) {
    console.error("Three.js Error:", error);
  }
} else {
  // If it IS mobile, we just log it and do nothing
  console.log("Mobile detected: 3D Scene Skipped for Performance");
}



const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* =========================================
   2. MENU INTERACTION (The Fix)
   ========================================= */
const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-item');
const menuInfo = document.querySelector('.menu-info');

// Master Timeline for Menu
const menuTl = gsap.timeline({ paused: true });

menuTl
  .to(menuOverlay, {
    y: 0,
    duration: 0.6,
    ease: "power4.inOut"
  })
  .to([menuLinks, menuInfo], {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 0.4,
    ease: "power2.out"
  }, "-=0.3"); // Overlap slightly

// Functions
function openMenu() {
  menuTl.play();
  menuToggle.classList.add('is-active'); // Turns lines into X
}

function closeMenu() {
  menuTl.reverse();
  menuToggle.classList.remove('is-active'); // Turns X back to lines
}

// Event Listeners
if (menuToggle) {
  // Hover to Open
  menuToggle.addEventListener('mouseenter', openMenu);

  // Click to Toggle (Mobile fallback)
  menuToggle.addEventListener('click', () => {
    if (menuToggle.classList.contains('is-active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

// Close when leaving the overlay
if (menuOverlay) {
  menuOverlay.addEventListener('mouseleave', closeMenu);
}

/* =========================================
   3. HERO ANIMATION (High-Performance Mode)
   ========================================= */
function initHeroAnimation() {
  const heroText = document.querySelectorAll('.reveal-text h1');

  // 1. Wait for Custom Fonts to finish loading (Prevents layout shift/lag)
  document.fonts.ready.then(() => {

    if (heroText.length > 0) {
      // 2. Use .fromTo() instead of .to()
      // This forces the browser to know EXACTLY where to start and end, reducing calculation time.
      gsap.fromTo(heroText,
        {
          y: 100, // Explicit starting position
          opacity: 0,
          willChange: "transform" // Tells browser to prep the GPU
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.1, // Slightly faster feels smoother
          stagger: 0.1,  // Faster stagger (0.3 is too slow for modern feel)
          ease: "power3.out", // "power3" is snappier than "power4"
          delay: 0.2,
          force3D: true, // CRITICAL: Forces GPU Hardware Acceleration
          clearProps: "willChange" // Cleanup to save memory after animation
        }
      );
    }

  });
}

// Animate inner-page content sections with a subtle fade-in
const contentSections = document.querySelectorAll(
  '.about-content, .contact-content, .projects-container, .playground-container'
);
if (contentSections.length > 0) {
  // Animate to visible state (initial hidden state is set via CSS below)
  gsap.to(contentSections, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    delay: 0.8
  });
}

// --- HOME PAGE SPECIFIC ---
initGithubBoard();
initGithubRepos();
initGithubStats();
initScrollAnimations();

// --- PROJECT DETAIL PAGE ---
initProjectDetail();


/* =========================================
   PROJECT DETAIL PAGE (Live GitHub API)
   ========================================= */
async function initProjectDetail() {
  const heroEl = document.getElementById('pd-hero');
  if (!heroEl) return; // Not on this page

  // Map GitHub repo names → local video files
  const VIDEO_MAP = {
    'BOPIS---Buy-Online-Pick-Up-In-Store': '/assets/videos/BOPIS project.mp4',
    'Delay-Reverb-Time-Calculator': '/assets/videos/reverb calculater.mp4',
    'my-healer-': '/assets/videos/my healer.mp4',
    'chinmaya-watch-shop-e-commers': '/assets/videos/e-com watch shop.mp4',
  };

  const params = new URLSearchParams(window.location.search);
  const repoName = params.get('repo');
  if (!repoName) {
    document.getElementById('pd-title').textContent = 'No project specified';
    return;
  }

  // Set page title
  const readableName = repoName.replace(/-/g, ' ');
  document.title = `Chinmaya | ${readableName}`;

  // Inject video if available
  const videoSrc = VIDEO_MAP[repoName] || VIDEO_MAP[repoName.toLowerCase()];
  if (videoSrc) {
    const videoArea = document.getElementById('pd-video-area');
    const wrapper = videoArea.querySelector('.video-wrapper');
    // Remove placeholder, add real video
    wrapper.innerHTML = `
      <video autoplay muted loop playsinline>
        <source src="${videoSrc}" type="video/mp4">
      </video>
    `;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/chinmayaranjanswain/${repoName}`);
    if (!res.ok) {
      document.getElementById('pd-title').textContent = 'Project Not Found';
      return;
    }

    const repo = await res.json();

    // Title
    document.getElementById('pd-title').textContent = readableName;

    // Language
    const langEl = document.getElementById('pd-language');
    langEl.textContent = repo.language ? repo.language.toUpperCase() : 'PROJECT';

    // Date
    const dateEl = document.getElementById('pd-date');
    const created = new Date(repo.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const updated = new Date(repo.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    dateEl.textContent = `Created ${created} • Updated ${updated}`;

    // Description
    const descEl = document.getElementById('pd-description');
    descEl.textContent = repo.description || 'No description available for this project.';

    // Stats
    document.getElementById('pd-stars').textContent = repo.stargazers_count;
    document.getElementById('pd-forks').textContent = repo.forks_count;
    document.getElementById('pd-size').textContent = repo.size;

    // GitHub Link
    const ghLink = document.getElementById('pd-github-link');
    ghLink.href = repo.html_url;

    // Live demo link (if homepage is set)
    const liveLink = document.getElementById('pd-live-link');
    if (repo.homepage) {
      liveLink.href = repo.homepage;
      liveLink.style.display = 'inline-block';
    }

    // Tech tags (fetch languages)
    try {
      const langRes = await fetch(repo.languages_url);
      if (langRes.ok) {
        const languages = await langRes.json();
        const tagsEl = document.getElementById('pd-tags');
        tagsEl.innerHTML = '';
        Object.keys(languages).forEach(lang => {
          const tag = document.createElement('span');
          tag.classList.add('pd-tag');
          tag.textContent = lang;
          tagsEl.appendChild(tag);
        });
      }
    } catch (e) { /* ignore */ }

    // README
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/chinmayaranjanswain/${repoName}/readme`, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' }
      });
      if (readmeRes.ok) {
        const readmeText = await readmeRes.text();
        const readmeContent = document.getElementById('pd-readme-content');
        // Simple markdown-to-HTML rendering (basic)
        readmeContent.innerHTML = readmeText
          .replace(/^### (.*$)/gim, '<h4>$1</h4>')
          .replace(/^## (.*$)/gim, '<h3>$1</h3>')
          .replace(/^# (.*$)/gim, '<h2>$1</h2>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/\n/g, '<br>');
      } else {
        document.getElementById('pd-readme').style.display = 'none';
      }
    } catch (e) {
      document.getElementById('pd-readme').style.display = 'none';
    }

    // Animate elements in
    // Animate to visible (initial hidden state set via CSS)
    gsap.to('.pd-hero', { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 });
    gsap.to('.pd-showcase', { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 });
    gsap.to('.pd-readme', { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.0 });

  } catch (e) {
    console.error('Failed to load project:', e);
    document.getElementById('pd-title').textContent = 'Error Loading Project';
  }
}

/* =========================================
   3a. GITHUB CONTRIBUTION BOARD (Live via API)
   ========================================= */
const GITHUB_USERNAME = 'chinmayaranjanswain';

async function initGithubBoard() {
  const board = document.getElementById('contribution-board');
  if (!board) return;

  // Build a 364-day grid (52 weeks x 7 days)
  const today = new Date();
  const dayContributions = {};

  // Fetch real events from GitHub API
  try {
    const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`);
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      events.forEach(event => {
        // Count meaningful contribution events
        if (['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'PullRequestReviewEvent'].includes(event.type)) {
          const date = event.created_at.split('T')[0]; // YYYY-MM-DD
          dayContributions[date] = (dayContributions[date] || 0) + 1;
        }
      });
    }
  } catch (e) {
    console.log('GitHub events fetch failed, using fallback data');
  }

  // Generate 364 cells, mapping real contribution data
  for (let i = 363; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const cell = document.createElement('div');
    cell.classList.add('contrib-cell');

    const count = dayContributions[dateStr] || 0;
    let level;
    if (count === 0) level = 0;
    else if (count <= 2) level = 1;
    else if (count <= 4) level = 2;
    else if (count <= 7) level = 3;
    else level = 4;

    cell.classList.add(`contrib-${level}`);
    cell.title = `${dateStr}: ${count} contribution${count !== 1 ? 's' : ''}`;
    board.appendChild(cell);
  }

  // Animate cells appearing with a wave effect
  const cells = board.querySelectorAll('.contrib-cell');
  gsap.from(cells, {
    scale: 0,
    duration: 0.3,
    stagger: { each: 0.003, from: "start" },
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: board,
      start: "top 80%",
    }
  });
}

/* =========================================
   3b. GITHUB REPOS (Live via API)
   ========================================= */
async function initGithubRepos() {
  const grid = document.getElementById('recent-projects-grid');
  if (!grid) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`);
    if (!res.ok) return;

    const repos = await res.json();

    // Filter out the profile readme repo and take top 6
    const filtered = repos
      .filter(r => r.name !== GITHUB_USERNAME)
      .slice(0, 6);

    filtered.forEach((repo, i) => {
      const link = document.createElement('a');
      link.href = `/project-detail.html?repo=${repo.name}`;
      link.classList.add('recent-project');

      const num = String(i + 1).padStart(2, '0');
      const lang = repo.language || 'Misc';
      const desc = repo.description
        ? (repo.description.length > 60 ? repo.description.slice(0, 60) + '…' : repo.description)
        : 'No description';

      link.innerHTML = `
        <span class="rp-num">${num}</span>
        <div class="rp-info">
          <h3>${repo.name.replace(/-/g, ' ')}</h3>
          <p>${lang} • ${desc}</p>
        </div>
        <span class="rp-arrow">→</span>
      `;

      grid.appendChild(link);
    });

    // Animate the dynamically created project rows
    const recentProjects = grid.querySelectorAll('.recent-project');
    if (recentProjects.length > 0) {
      gsap.from(recentProjects, {
        x: -30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
        }
      });
    }
  } catch (e) {
    console.log('GitHub repos fetch failed');
  }
}

/* =========================================
   3c. GITHUB PROFILE STATS (Live via API)
   ========================================= */
async function initGithubStats() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!res.ok) return;

    const user = await res.json();

    // Update stat numbers with real data
    const reposEl = document.getElementById('stat-repos');
    const followersEl = document.getElementById('stat-followers');
    const followingEl = document.getElementById('stat-following');

    if (reposEl) reposEl.textContent = user.public_repos;
    if (followersEl) followersEl.textContent = user.followers;
    if (followingEl) followingEl.textContent = user.following;
  } catch (e) {
    console.log('GitHub stats fetch failed');
  }
}

/* =========================================
   3d. SCROLL-TRIGGERED SECTION ANIMATIONS
   ========================================= */
function initScrollAnimations() {
  // Animate each section on scroll
  const sectionHeaders = document.querySelectorAll(
    '.showreel-section, .github-section, .recent-projects-section, .gallery-section, .site-footer'
  );

  sectionHeaders.forEach((section) => {
    gsap.from(section, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
      }
    });
  });

  // Gallery items stagger
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    gsap.from(galleryItems, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.gallery-grid',
        start: "top 80%",
      }
    });
  }

  // Stats counter animation
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach((el) => {
    const target = parseInt(el.textContent);
    if (isNaN(target)) return;
    el.textContent = '0';

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(el, {
          duration: 1.5,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = Math.round(target * this.progress());
          }
        });
      },
      once: true
    });
  });
}

/* =========================================
   4. CUSTOM CURSOR
   ========================================= */
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 1,
    ease: "power2.out"
  });
});

/* =========================================
   5. LIVE CLOCK (India Standard Time)
   ========================================= */
function updateClock() {
  const timeEl = document.querySelector('.current-time');
  if (timeEl) {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    timeEl.textContent = now.toLocaleString('en-IN', options);
  }
}

// Update immediately, then every second
updateClock();
setInterval(updateClock, 1000);

/* =========================================
   6. PAGE LOADER ANIMATION
   ========================================= */
function initLoader() {
  const loader = document.querySelector('.page-loader');
  const letters = document.querySelectorAll('.loader-text span');

  // Reveal body (loader covers it so no FOUC)
  document.body.classList.add('loaded');

  if (!loader || letters.length === 0) {
    initHeroAnimation();
    return;
  }

  const loaderTl = gsap.timeline({
    onComplete: () => {
      // Remove loader from DOM after animation
      loader.remove();
      // Now play the hero text reveal
      initHeroAnimation();
    }
  });

  // Phase 1: Letters bounce in (staggered, elastic)
  loaderTl.from(letters, {
    y: 80,
    opacity: 0,
    duration: 0.6,
    stagger: 0.05,
    ease: "back.out(1.7)",
  });

  // Phase 2: Letters continuously bounce for ~2 seconds
  loaderTl.to(letters, {
    y: -20,
    duration: 0.4,
    stagger: { each: 0.06, repeat: 3, yoyo: true },
    ease: "power2.inOut",
  }, "+=0.2");

  // Phase 3: Shutter opens upward (like a shop shutter)
  loaderTl.to(loader, {
    y: "-100%",
    duration: 0.8,
    ease: "power4.inOut",
  }, "+=0.3");
}

/* =========================================
   7. PAGE TRANSITION (Smooth navigation)
   ========================================= */
function initPageTransitions() {
  // Create the transition overlay element
  const transitionEl = document.createElement('div');
  transitionEl.classList.add('page-transition');
  document.body.appendChild(transitionEl);

  // Intercept all internal link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external links, anchors, pdf, and mailto
    if (
      href.startsWith('http') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.endsWith('.pdf') ||
      link.getAttribute('target') === '_blank'
    ) {
      return;
    }

    // Skip if already on this page
    if (href === window.location.pathname) return;

    e.preventDefault();

    // Animate: black panel slides UP from bottom, covering the page
    gsap.to(transitionEl, {
      y: 0, // from translateY(100%) to 0 (covers page)
      duration: 0.6,
      ease: "power4.inOut",
      onComplete: () => {
        window.location.href = href;
      }
    });
  });
}

/* =========================================
   8. DARK / LIGHT MODE TOGGLE
   ========================================= */
function updateThreeColors(isLight) {
  if (isLight) {
    wireMaterial.color.setHex(0x1a1a2e);
    wireMaterial.opacity = 0.5;
    volumeMaterial.color.setHex(0x1a1a2e);
    volumeMaterial.opacity = 0.08;
    if (canvas) canvas.style.filter = 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.15))';
  } else {
    wireMaterial.color.setHex(0xffffff);
    wireMaterial.opacity = 0.4;
    volumeMaterial.color.setHex(0xffffff);
    volumeMaterial.opacity = 0.05;
    if (canvas) canvas.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))';
  }
}

function initThemeToggle() {
  // Apply saved theme FIRST — this must run on every page
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    updateThreeColors(true);
  }

  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return; // No toggle button on this page, but theme is already applied

  const icon = toggle.querySelector('.theme-icon');
  const label = toggle.querySelector('.theme-label');

  // Sync button UI with saved theme
  if (savedTheme === 'light') {
    if (icon) icon.textContent = '☀️';
    if (label) label.textContent = 'Light';
  }

  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    if (icon) icon.textContent = isLight ? '☀️' : '🌙';
    if (label) label.textContent = isLight ? 'Light' : 'Dark';
    updateThreeColors(isLight);
  });
}

// Initialize everything
initThemeToggle();
initPageTransitions();
initLoader();