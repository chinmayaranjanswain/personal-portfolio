import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Vector utility classes
class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static random(min, max) {
    return min + Math.random() * (max - min);
  }
}

class Vector3D {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// Star particle class
class Star {
  constructor(cameraZ, cameraTravelDistance) {
    this.angle = Math.random() * Math.PI * 2;
    this.distance = 30 * Math.random() + 15;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.expansionRate = 1.2 + Math.random() * 0.8;
    this.finalScale = 0.7 + Math.random() * 0.6;

    this.dx = this.distance * Math.cos(this.angle);
    this.dy = this.distance * Math.sin(this.angle);

    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3;
    this.z = Vector2D.random(0.5 * cameraZ, cameraTravelDistance + cameraZ);

    const lerp = (s, e, t) => s * (1 - t) + e * t;
    this.z = lerp(this.z, cameraTravelDistance / 2, 0.3 * this.spiralLocation);
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0);
  }

  render(p, ctrl) {
    const spiralPos = ctrl.spiralPath(this.spiralLocation);
    const q = p - this.spiralLocation;

    if (q > 0) {
      const dp = ctrl.constrain(4 * q, 0, 1);
      const linearE = dp;
      const elasticE = ctrl.easeOutElastic(dp);
      const powerE = Math.pow(dp, 2);

      let easing;
      if (dp < 0.3) {
        easing = ctrl.lerp(linearE, powerE, dp / 0.3);
      } else if (dp < 0.7) {
        easing = ctrl.lerp(powerE, elasticE, (dp - 0.3) / 0.4);
      } else {
        easing = elasticE;
      }

      let screenX, screenY;

      if (dp < 0.3) {
        screenX = ctrl.lerp(spiralPos.x, spiralPos.x + this.dx * 0.3, easing / 0.3);
        screenY = ctrl.lerp(spiralPos.y, spiralPos.y + this.dy * 0.3, easing / 0.3);
      } else if (dp < 0.7) {
        const mid = (dp - 0.3) / 0.4;
        const curve = Math.sin(mid * Math.PI) * this.rotationDirection * 1.5;
        const bx = spiralPos.x + this.dx * 0.3;
        const by = spiralPos.y + this.dy * 0.3;
        const tx = spiralPos.x + this.dx * 0.7;
        const ty = spiralPos.y + this.dy * 0.7;
        const px = -this.dy * 0.4 * curve;
        const py = this.dx * 0.4 * curve;
        screenX = ctrl.lerp(bx, tx, mid) + px * mid;
        screenY = ctrl.lerp(by, ty, mid) + py * mid;
      } else {
        const fp = (dp - 0.7) / 0.3;
        const bx = spiralPos.x + this.dx * 0.7;
        const by = spiralPos.y + this.dy * 0.7;
        const td = this.distance * this.expansionRate * 1.5;
        const sa = this.angle + 1.2 * this.rotationDirection * fp * Math.PI;
        const tx = spiralPos.x + td * Math.cos(sa);
        const ty = spiralPos.y + td * Math.sin(sa);
        screenX = ctrl.lerp(bx, tx, fp);
        screenY = ctrl.lerp(by, ty, fp);
      }

      const vx = (this.z - ctrl.cameraZ) * screenX / ctrl.viewZoom;
      const vy = (this.z - ctrl.cameraZ) * screenY / ctrl.viewZoom;
      const position = new Vector3D(vx, vy, this.z);

      let sizeMul = 1.0;
      if (dp < 0.6) {
        sizeMul = 1.0 + dp * 0.2;
      } else {
        const t = (dp - 0.6) / 0.4;
        sizeMul = 1.2 * (1.0 - t) + this.finalScale * t;
      }

      ctrl.showProjectedDot(position, 8.5 * this.strokeWeightFactor * sizeMul);
    }
  }
}

// Animation Controller
class AnimController {
  constructor(canvas, ctx, dpr, size) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.dpr = dpr;
    this.size = size;
    this.time = 0;
    this.stars = [];

    this.changeEventTime = 0.32;
    this.cameraZ = -400;
    this.cameraTravelDistance = 3400;
    this.startDotYOffset = 28;
    this.viewZoom = 100;
    this.numberOfStars = 5000;
    this.trailLength = 80;

    this.initStars();
    this.timeline = gsap.timeline({ repeat: -1 });
    this.timeline.to(this, {
      time: 1,
      duration: 15,
      repeat: -1,
      ease: 'none',
      onUpdate: () => this.render(),
    });
  }

  initStars() {
    const origRandom = Math.random;
    let seed = 1234;
    Math.random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < this.numberOfStars; i++) {
      this.stars.push(new Star(this.cameraZ, this.cameraTravelDistance));
    }
    Math.random = origRandom;
  }

  ease(p, g) {
    return p < 0.5 ? 0.5 * Math.pow(2 * p, g) : 1 - 0.5 * Math.pow(2 * (1 - p), g);
  }

  easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 4.5;
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1;
  }

  map(v, s1, e1, s2, e2) {
    return s2 + (e2 - s2) * ((v - s1) / (e1 - s1));
  }

  constrain(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  lerp(s, e, t) {
    return s * (1 - t) + e * t;
  }

  spiralPath(p) {
    p = this.constrain(1.2 * p, 0, 1);
    p = this.ease(p, 1.8);
    const turns = 6;
    const theta = 2 * Math.PI * turns * Math.sqrt(p);
    const r = 170 * Math.sqrt(p);
    return new Vector2D(r * Math.cos(theta), r * Math.sin(theta) + this.startDotYOffset);
  }

  showProjectedDot(position, sizeFactor) {
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
    const newCamZ = this.cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance;

    if (position.z > newCamZ) {
      const depth = position.z - newCamZ;
      const x = this.viewZoom * position.x / depth;
      const y = this.viewZoom * position.y / depth;
      const sw = 400 * sizeFactor / depth;
      this.ctx.lineWidth = sw;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawStartDot() {
    if (this.time > this.changeEventTime) {
      const dy = this.cameraZ * this.startDotYOffset / this.viewZoom;
      this.showProjectedDot(new Vector3D(0, dy, this.cameraTravelDistance), 2.5);
    }
  }

  drawTrail(t1) {
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1);
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f;
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = sw;

      const pt = t1 - 0.00015 * i;
      const pos = this.spiralPath(pt);
      const offset = new Vector2D(pos.x + 5, pos.y + 5);

      const mid = new Vector2D((pos.x + offset.x) / 2, (pos.y + offset.y) / 2);
      const dx = pos.x - mid.x;
      const dy = pos.y - mid.y;
      const angle = Math.atan2(dy, dx);
      const dir = i % 2 === 0 ? -1 : 1;
      const r = Math.sqrt(dx * dx + dy * dy);
      const p2 = Math.sin(this.time * Math.PI * 2) * 0.5 + 0.5;
      const bounce = Math.sin(p2 * Math.PI) * 0.05 * (1 - p2);
      const rx = mid.x + r * (1 + bounce) * Math.cos(angle + dir * Math.PI * this.easeOutElastic(p2));
      const ry = mid.y + r * (1 + bounce) * Math.sin(angle + dir * Math.PI * this.easeOutElastic(p2));

      this.ctx.beginPath();
      this.ctx.arc(rx, ry, sw / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  render() {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.size, this.size);
    ctx.save();
    ctx.translate(this.size / 2, this.size / 2);

    const t1 = this.constrain(this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1), 0, 1);
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);

    ctx.rotate(-Math.PI * this.ease(t2, 2.7));

    this.drawTrail(t1);

    ctx.fillStyle = 'white';
    for (const star of this.stars) {
      star.render(t1, this);
    }

    this.drawStartDot();
    ctx.restore();
  }

  destroy() {
    this.timeline.kill();
  }
}

// =============================================
// REACT COMPONENT — PageLoader (Spiral Intro)
// =============================================
export default function PageLoader({ onComplete }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const containerRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const [phase, setPhase] = useState('loading');

  // Counter animation
  useEffect(() => {
    if (counter >= 100 || phase !== 'loading') return;
    const speed = counter < 20 ? 65
      : counter < 50 ? 50
        : counter < 75 ? 70
          : counter < 90 ? 90
            : counter < 98 ? 120
              : 180;
    const timer = setTimeout(() => {
      setCounter((prev) => Math.min(prev + 1, 100));
    }, speed);
    return () => clearTimeout(timer);
  }, [counter, phase]);

  // Initialize spiral animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const size = Math.max(w, h);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    animRef.current = new AnimController(canvas, ctx, dpr, size);

    const handleResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      const ns = Math.max(nw, nh);
      canvas.width = ns * dpr;
      canvas.height = ns * dpr;
      canvas.style.width = `${nw}px`;
      canvas.style.height = `${nh}px`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, []);

  // Exit animation when counter hits 100
  useEffect(() => {
    if (counter < 100 || phase !== 'loading') return;
    setPhase('exiting');

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('done');
        onComplete();
      },
    });

    tl.to({}, { duration: 1.2 });

    tl.to('.intro-overlay-top, .intro-overlay-bottom', {
      opacity: 0,
      y: -30,
      filter: 'blur(8px)',
      duration: 0.6,
      ease: 'power3.in',
    });

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    }, '-=0.3');
  }, [counter, phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className="intro-sequence"
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Top text — name */}
      <div className="intro-overlay-top">
        <div className="intro-overlay-line" />
        <h1 className="intro-overlay-name">CHINMAYA</h1>
        <p className="intro-overlay-sub">Portfolio</p>
      </div>

      {/* Bottom text — counter */}
      <div className="intro-overlay-bottom">
        <div className="intro-overlay-counter">
          <span className="intro-overlay-num">{counter}</span>
          <span className="intro-overlay-pct">%</span>
        </div>
      </div>

      <div className="intro-overlay-coord intro-overlay-coord-tl">20.4625° N</div>
      <div className="intro-overlay-coord intro-overlay-coord-br">85.8830° E</div>
    </div>
  );
}
