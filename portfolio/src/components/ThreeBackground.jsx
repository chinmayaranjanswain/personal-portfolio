import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ isLightMode }) {
  const canvasRef = useRef(null);
  const materialsRef = useRef({ wire: null, volume: null });
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    // Only run on desktop
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const scene = new THREE.Scene();

      const geometry = new THREE.TorusKnotGeometry(10, 3, 200, 32);

      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });

      const volumeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        transmission: 0.9,
        thickness: 1,
        roughness: 0.1,
      });

      materialsRef.current = { wire: wireMaterial, volume: volumeMaterial };

      const wireframeMesh = new THREE.Mesh(geometry, wireMaterial);
      const volumeMesh = new THREE.Mesh(geometry, volumeMaterial);

      const abstractObject = new THREE.Group();
      abstractObject.add(wireframeMesh);
      abstractObject.add(volumeMesh);
      abstractObject.position.x = 25;
      scene.add(abstractObject);

      const light = new THREE.PointLight(0xffffff, 50, 100);
      light.position.set(20, 10, 20);
      scene.add(light);

      const sizes = { width: window.innerWidth, height: window.innerHeight };
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
      camera.position.z = 30;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      const clock = new THREE.Clock();
      const mouse = { x: 0, y: 0 };
      const smoothMouse = { x: 0, y: 0 };

      function lerp(start, end, factor) {
        return start + (end - start) * factor;
      }

      const handleMouseMove = (e) => {
        mouse.x = (e.clientX / sizes.width) * 2 - 1;
        mouse.y = -(e.clientY / sizes.height) * 2 + 1;
      };
      document.addEventListener('mousemove', handleMouseMove);

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.03);
        smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.03);

        abstractObject.position.x = 25 + smoothMouse.x * 5;
        abstractObject.position.y = Math.sin(elapsedTime * 0.15) * 1.0 + smoothMouse.y * 3;

        abstractObject.rotation.y = elapsedTime * 0.04;
        abstractObject.rotation.x = elapsedTime * 0.05;
        abstractObject.rotation.z = Math.sin(elapsedTime * 0.08) * 0.05;

        const scale = 1 + Math.sin(elapsedTime * 0.2) * 0.02;
        abstractObject.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
        animationIdRef.current = window.requestAnimationFrame(tick);
      };

      tick();

      const handleResize = () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        renderer.dispose();
        geometry.dispose();
        wireMaterial.dispose();
        volumeMaterial.dispose();
      };
    } catch (error) {
      console.error('Three.js Error:', error);
    }
  }, []);

  // Update colors when theme changes
  useEffect(() => {
    const { wire, volume } = materialsRef.current;
    if (!wire || !volume) return;

    if (isLightMode) {
      wire.color.setHex(0x1a1a2e);
      wire.opacity = 0.5;
      volume.color.setHex(0x1a1a2e);
      volume.opacity = 0.08;
    } else {
      wire.color.setHex(0xffffff);
      wire.opacity = 0.4;
      volume.color.setHex(0xffffff);
      volume.opacity = 0.05;
    }
  }, [isLightMode]);

  return <canvas id="webgl-canvas" ref={canvasRef} />;
}
