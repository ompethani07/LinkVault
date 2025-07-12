'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

interface LinkVault3DLogoProps {
  width?: number;
  height?: number;
  onAnimationComplete?: () => void;
}

export default function LinkVault3DLogo({ 
  width = 800, 
  height = 400,
  onAnimationComplete
}: LinkVault3DLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Professional scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 20, 100);
    sceneRef.current = scene;

    // Advanced camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 25);
    camera.lookAt(0, 0, 0);

    // Professional renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Professional text loader
    const fontLoader = new FontLoader();
    
    // Create professional material with custom shader
    const createProfessionalMaterial = (color: number, emissiveIntensity: number) => {
      return new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        emissive: color,
        emissiveIntensity: emissiveIntensity,
        transmission: 0.1,
        thickness: 0.5,
        ior: 1.5,
        sheen: 0.8,
        sheenRoughness: 0.2,
        sheenColor: new THREE.Color(color).multiplyScalar(0.5),
      });
    };

    // Create particle system for professional effects
    const createParticleSystem = () => {
      const particles = new THREE.BufferGeometry();
      const particleCount = 2000;
      
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        const color = new THREE.Color(0xffffff);
        color.setHSL(Math.random() * 0.2, 1.0, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = Math.random() * 3 + 1;
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      
      return new THREE.Points(particles, particleMaterial);
    };

    // Create professional 3D text
    const createText = (text: string, position: THREE.Vector3, color: number, emissiveIntensity: number) => {
      const textGeometry = new TextGeometry(text, {
        font: null as any, // Will be set when font loads
        size: 4,
        depth: 1.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 8,
      });
      
      const material = createProfessionalMaterial(color, emissiveIntensity);
      const textMesh = new THREE.Mesh(textGeometry, material);
      
      textMesh.position.copy(position);
      textMesh.castShadow = true;
      textMesh.receiveShadow = true;
      
      return textMesh;
    };

    // Animation states
    const animationState = {
      phase: 0, // 0: initial, 1: LV appear, 2: letters fall, 3: complete
      time: 0,
      letterMeshes: [] as THREE.Mesh[],
      particles: null as THREE.Points | null,
      startTime: Date.now(),
    };

    // Create letter meshes (without font initially)
    const letters = ['L', 'i', 'n', 'k', 'V', 'a', 'u', 'l', 't'];
    const letterColors = [
      0xFF6B35, 0xFF4500, 0xFF8C00, 0xFFA500, // Link - orange gradient
      0x4F46E5, 0x6366F1, 0x8B5CF6, 0xA855F7, 0xC084FC // Vault - purple gradient
    ];

    // Professional lighting setup
    const setupLighting = () => {
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
      scene.add(ambientLight);

      // Key light system
      const keyLight = new THREE.DirectionalLight(0xFF6B35, 8.0);
      keyLight.position.set(-20, 20, 20);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 4096;
      keyLight.shadow.mapSize.height = 4096;
      keyLight.shadow.camera.near = 0.1;
      keyLight.shadow.camera.far = 100;
      keyLight.shadow.camera.left = -50;
      keyLight.shadow.camera.right = 50;
      keyLight.shadow.camera.top = 50;
      keyLight.shadow.camera.bottom = -50;
      keyLight.shadow.bias = -0.0001;
      scene.add(keyLight);

      // Fill light
      const fillLight = new THREE.DirectionalLight(0x4F46E5, 5.0);
      fillLight.position.set(20, 20, -20);
      fillLight.castShadow = true;
      fillLight.shadow.mapSize.width = 2048;
      fillLight.shadow.mapSize.height = 2048;
      scene.add(fillLight);

      // Rim lights
      const rimLight1 = new THREE.DirectionalLight(0xFF1493, 3.0);
      rimLight1.position.set(0, -20, 20);
      scene.add(rimLight1);

      const rimLight2 = new THREE.DirectionalLight(0x00FFFF, 2.0);
      rimLight2.position.set(0, 20, -20);
      scene.add(rimLight2);

      // Point lights for dynamic effects
      const pointLight1 = new THREE.PointLight(0xFF6B35, 10, 50);
      pointLight1.position.set(-10, 10, 10);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x4F46E5, 8, 50);
      pointLight2.position.set(10, 10, 10);
      scene.add(pointLight2);

      return { keyLight, fillLight, rimLight1, rimLight2, pointLight1, pointLight2 };
    };

    const lights = setupLighting();

    // Create particle system
    animationState.particles = createParticleSystem();
    scene.add(animationState.particles);

    // Create professional ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -8;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load font and create text
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      // Create all letter meshes
      letters.forEach((letter, index) => {
        const textGeometry = new TextGeometry(letter, {
          font: font,
          size: 4,
          depth: 1.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.2,
          bevelSize: 0.1,
          bevelSegments: 8,
        });

        textGeometry.computeBoundingBox();
        textGeometry.translate(
          -(textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x) / 2,
          -(textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y) / 2,
          0
        );

        const material = createProfessionalMaterial(letterColors[index], 0.8);
        const textMesh = new THREE.Mesh(textGeometry, material);
        
        // Initial positions (scattered above)
        textMesh.position.set(
          (Math.random() - 0.5) * 50,
          20 + Math.random() * 20,
          (Math.random() - 0.5) * 20
        );
        
        // Random rotation
        textMesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        
        textMesh.castShadow = true;
        textMesh.receiveShadow = true;
        
        // Hide initially (except L and V)
        if (letter !== 'L' && letter !== 'V') {
          textMesh.visible = false;
        }
        
        animationState.letterMeshes.push(textMesh);
        scene.add(textMesh);
      });

      // Start animation
      animationState.phase = 1;
    });

    // Professional animation system
    const animateScene = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - animationState.startTime;
      animationState.time += 0.01;

      // Phase 1: L and V appear with dramatic effect
      if (animationState.phase === 1 && deltaTime > 1000) {
        animationState.letterMeshes.forEach((mesh, index) => {
          if (letters[index] === 'L' || letters[index] === 'V') {
            // Dramatic entrance animation
            const progress = Math.min((deltaTime - 1000) / 2000, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            mesh.position.y = 20 - (20 * easeProgress);
            mesh.rotation.y = (Math.PI * 2) * (1 - easeProgress);
            mesh.scale.setScalar(easeProgress);
            
            // Update material glow
            if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
              mesh.material.emissiveIntensity = 0.8 + Math.sin(animationState.time * 3) * 0.4;
            }
          }
        });

        if (deltaTime > 4000) {
          animationState.phase = 2;
        }
      }

      // Phase 2: Other letters fall into place
      if (animationState.phase === 2) {
        const phaseStartTime = 4000;
        const letterDelay = 200;
        
        animationState.letterMeshes.forEach((mesh, index) => {
          if (letters[index] !== 'L' && letters[index] !== 'V') {
            const letterStartTime = phaseStartTime + (index * letterDelay);
            
            if (deltaTime > letterStartTime) {
              mesh.visible = true;
              const progress = Math.min((deltaTime - letterStartTime) / 1500, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 4);
              
              // Calculate final position
              const finalX = (index - 4) * 5;
              const finalY = 0;
              const finalZ = 0;
              
              // Animate position
              mesh.position.x = mesh.position.x + (finalX - mesh.position.x) * easeProgress;
              mesh.position.y = mesh.position.y + (finalY - mesh.position.y) * easeProgress;
              mesh.position.z = mesh.position.z + (finalZ - mesh.position.z) * easeProgress;
              
              // Animate rotation
              mesh.rotation.x *= (1 - easeProgress);
              mesh.rotation.y *= (1 - easeProgress);
              mesh.rotation.z *= (1 - easeProgress);
              
              // Scale effect
              mesh.scale.setScalar(easeProgress);
              
              // Glow effect
              if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
                mesh.material.emissiveIntensity = 0.8 + Math.sin(animationState.time * 2 + index) * 0.3;
              }
            }
          }
        });
        
        // Final positioning for L and V
        const lMesh = animationState.letterMeshes[0];
        const vMesh = animationState.letterMeshes[4];
        
        if (lMesh && vMesh) {
          const progress = Math.min((deltaTime - phaseStartTime) / 3000, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          lMesh.position.x = lMesh.position.x + (-20 - lMesh.position.x) * easeProgress;
          vMesh.position.x = vMesh.position.x + (20 - vMesh.position.x) * easeProgress;
        }
        
        if (deltaTime > phaseStartTime + 5000) {
          animationState.phase = 3;
          onAnimationComplete?.();
        }
      }

      // Phase 3: Final idle animation
      if (animationState.phase === 3) {
        animationState.letterMeshes.forEach((mesh, index) => {
          if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
            mesh.material.emissiveIntensity = 0.8 + Math.sin(animationState.time * 1.5 + index) * 0.2;
          }
          
          // Gentle floating
          mesh.position.y = Math.sin(animationState.time * 0.8 + index) * 0.1;
        });
      }

      // Animate particles
      if (animationState.particles) {
        animationState.particles.rotation.y += 0.001;
        const positions = animationState.particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(animationState.time + i) * 0.01;
        }
        animationState.particles.geometry.attributes.position.needsUpdate = true;
      }

      // Dynamic lighting
      lights.keyLight.intensity = 8.0 + Math.sin(animationState.time * 1.2) * 1.0;
      lights.fillLight.intensity = 5.0 + Math.cos(animationState.time * 0.8) * 0.5;
      lights.pointLight1.intensity = 10 + Math.sin(animationState.time * 2) * 2;
      lights.pointLight2.intensity = 8 + Math.cos(animationState.time * 1.5) * 2;

      // Camera animation
      if (animationState.phase < 3) {
        camera.position.x = Math.sin(animationState.time * 0.2) * 5;
        camera.position.y = 5 + Math.cos(animationState.time * 0.15) * 2;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animateScene);
    };

    animateScene();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      // Professional cleanup
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
    };
  }, [width, height, onAnimationComplete]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden rounded-lg"
      style={{ width, height }}
    />
  );
}
