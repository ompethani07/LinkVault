'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StaticLogoProps {
  size?: number;
}

export default function StaticLogo({ size = 40 }: StaticLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    container.appendChild(renderer.domElement);

    // Create custom LinkVault logo geometry
    const createLogoGeometry = () => {
      const group = new THREE.Group();
      
      // Create "L" shape
      const lGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.3);
      const lMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF, // Bright White
        metalness: 0.95,
        roughness: 0.05,
        emissive: 0xCCCCCC,
        emissiveIntensity: 0.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
      });
      
      const lMesh = new THREE.Mesh(lGeometry, lMaterial);
      lMesh.position.set(-0.8, 0, 0);
      lMesh.castShadow = true;
      
      // L horizontal part
      const lHorizontal = new THREE.BoxGeometry(0.8, 0.3, 0.3);
      const lHorizontalMesh = new THREE.Mesh(lHorizontal, lMaterial);
      lHorizontalMesh.position.set(-0.55, -0.6, 0);
      lHorizontalMesh.castShadow = true;
      
      // Create "V" shape
      const vMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFF0000, // Bright Red
        metalness: 0.95,
        roughness: 0.05,
        emissive: 0xFF0000,
        emissiveIntensity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
      });
      
      // V left arm
      const vLeftGeometry = new THREE.BoxGeometry(0.3, 1.2, 0.3);
      const vLeftMesh = new THREE.Mesh(vLeftGeometry, vMaterial);
      vLeftMesh.position.set(0.3, 0.2, 0);
      vLeftMesh.rotation.z = Math.PI / 6;
      vLeftMesh.castShadow = true;
      
      // V right arm
      const vRightMesh = new THREE.Mesh(vLeftGeometry, vMaterial);
      vRightMesh.position.set(0.7, 0.2, 0);
      vRightMesh.rotation.z = -Math.PI / 6;
      vRightMesh.castShadow = true;
      
      // Add connection element
      const connectionGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8);
      const connectionMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFF4444,
        metalness: 0.95,
        roughness: 0.05,
        emissive: 0xFF2222,
        emissiveIntensity: 0.7,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
      });
      
      const connectionMesh = new THREE.Mesh(connectionGeometry, connectionMaterial);
      connectionMesh.position.set(-0.1, 0, 0);
      connectionMesh.rotation.z = Math.PI / 2;
      connectionMesh.castShadow = true;
      
      group.add(lMesh);
      group.add(lHorizontalMesh);
      group.add(vLeftMesh);
      group.add(vRightMesh);
      group.add(connectionMesh);
      
      return group;
    };

    const logo = createLogoGeometry();
    scene.add(logo);

    // Professional lighting for shine
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(2, 2, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0xFF0000, 1.5);
    rimLight.position.set(-1, -1, 1);
    scene.add(rimLight);

    // Add additional key light for shine
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(-2, 3, 2);
    scene.add(keyLight);

    // Render once (static)
    renderer.render(scene, camera);

    return () => {
      // Cleanup
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose of THREE.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      scene.clear();
    };
  }, [size]);

  return (
    <div 
      ref={containerRef} 
      className="inline-block"
      style={{ width: size, height: size }}
    />
  );
}
