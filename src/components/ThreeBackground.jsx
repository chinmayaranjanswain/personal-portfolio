import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function ThreeBackground({ loaderDone }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const modelRef = useRef(null);
  const rotationActiveRef = useRef(false);
  const rotationStartTimeRef = useRef(null);

  // Activate rotation 1s after loader finishes
  useEffect(() => {
    if (!loaderDone) return;
    const timer = setTimeout(() => {
      rotationActiveRef.current = true;
    }, 1000);
    return () => clearTimeout(timer);
  }, [loaderDone]);

  useEffect(() => {
    // Only run on desktop
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const scene = new THREE.Scene();

      const sizes = { width: window.innerWidth, height: window.innerHeight };
      const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
      camera.position.set(0, 1, 5);
      camera.lookAt(0, 0.5, 0);

      // Lighting setup for the computer model
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
      mainLight.position.set(5, 8, 5);
      mainLight.castShadow = true;
      scene.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0x38f9d7, 0.4);
      fillLight.position.set(-5, 3, -3);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight(0x667eea, 0.6, 20);
      rimLight.position.set(-3, 2, -5);
      scene.add(rimLight);

      // Subtle accent glow from below
      const underLight = new THREE.PointLight(0x38f9d7, 0.3, 15);
      underLight.position.set(0, -2, 2);
      scene.add(underLight);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      rendererRef.current = renderer;

      // Load the computer model
      const loader = new GLTFLoader();
      loader.load(
        '/my_computer.glb',
        (gltf) => {
          const model = gltf.scene;

          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Normalize scale so the model fits nicely
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / maxDim;
          model.scale.setScalar(scale);

          // Center it
          model.position.x = -center.x * scale;
          model.position.y = -center.y * scale;
          model.position.z = -center.z * scale;

          // Wrap in a group for easy rotation
          const pivot = new THREE.Group();
          pivot.add(model);

          // Position the computer to the right side of the screen
          pivot.position.set(2.2, 0.2, 0);

          scene.add(pivot);
          modelRef.current = pivot;
        },
        undefined,
        (error) => {
          console.error('Error loading computer model:', error);
        }
      );

      // Mouse tracking
      const mouse = { x: 0, y: 0 };
      const smoothMouse = { x: 0, y: 0 };
      const targetRotation = { x: 0, y: 0 };

      function lerp(start, end, factor) {
        return start + (end - start) * factor;
      }

      const handleMouseMove = (e) => {
        mouse.x = (e.clientX / sizes.width) * 2 - 1;
        mouse.y = -(e.clientY / sizes.height) * 2 + 1;
      };
      document.addEventListener('mousemove', handleMouseMove);

      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse interpolation
        smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.04);
        smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.04);

        if (modelRef.current) {
          // Only rotate after loader is done + delay
          if (!rotationActiveRef.current) {
            renderer.render(scene, camera);
            animationIdRef.current = window.requestAnimationFrame(tick);
            return;
          }

          // Calculate time since rotation started
          if (rotationStartTimeRef.current === null) {
            rotationStartTimeRef.current = elapsedTime;
          }
          const rotationTime = elapsedTime - rotationStartTimeRef.current;

          // Slow continuous auto-rotation + cursor-driven tilt
          const AUTO_SPIN_SPEED = 0.15; // rad/s
          const autoY = rotationTime * AUTO_SPIN_SPEED;

          // Cursor adds rotation on top of auto-spin
          targetRotation.y = autoY + smoothMouse.x * 0.4;
          targetRotation.x = -smoothMouse.y * 0.15;

          modelRef.current.rotation.y = lerp(
            modelRef.current.rotation.y,
            targetRotation.y,
            0.06
          );
          modelRef.current.rotation.x = lerp(
            modelRef.current.rotation.x,
            targetRotation.x,
            0.06
          );

          // Gentle floating motion
          modelRef.current.position.y =
            0.2 + Math.sin(elapsedTime * 0.8) * 0.08;

          // Subtle cursor-driven position shift (parallax feel)
          modelRef.current.position.x = lerp(
            modelRef.current.position.x,
            2.2 + smoothMouse.x * 0.3,
            0.04
          );
        }

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
      };
    } catch (error) {
      console.error('Three.js Error:', error);
    }
  }, []);

  return <canvas id="webgl-canvas" ref={canvasRef} />;
}
