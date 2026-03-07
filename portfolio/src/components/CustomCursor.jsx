import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Skip on mobile
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 1,
        ease: 'power2.out',
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return <div className="custom-cursor" ref={cursorRef} />;
}
