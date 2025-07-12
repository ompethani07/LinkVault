'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function AnimatedLogo({ size = 40 }: { size?: number }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const chainLinksRef = useRef<THREE.Group>()
  const animationIdRef = useRef<number>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      1, // aspect ratio will be 1:1 for square logo
      0.1,
      1000
    )
    camera.position.set(0, 0, 8)

    // Renderer setup with high quality
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // transparent background
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    rendererRef.current = renderer

    // Advanced lighting setup (like Amp)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    scene.add(ambientLight)

    // Main key light (bright blue-white)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
    keyLight.position.set(5, 5, 5)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    scene.add(keyLight)

    // Fill light (soft blue)
    const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.8)
    fillLight.position.set(-3, 0, 3)
    scene.add(fillLight)

    // Rim light (creates the glow effect)
    const rimLight = new THREE.DirectionalLight(0x80c7ff, 1.2)
    rimLight.position.set(0, 0, -5)
    scene.add(rimLight)

    // Professional metallic material (like Amp logo)
    const chainMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      envMapIntensity: 1.5,
      transparent: false
    })

    // Create chain link geometry
    const createChainLink = () => {
      const geometry = new THREE.TorusGeometry(1.2, 0.3, 16, 32)
      const link = new THREE.Mesh(geometry, chainMaterial)
      link.castShadow = true
      link.receiveShadow = true
      return link
    }

    // Create chain links group
    const chainLinks = new THREE.Group()
    chainLinksRef.current = chainLinks

    // First chain link
    const link1 = createChainLink()
    link1.scale.set(1, 0.6, 1) // Make it oval
    link1.position.set(-0.8, 0, 0)
    chainLinks.add(link1)

    // Second chain link (interlocked)
    const link2 = createChainLink()
    link2.scale.set(0.6, 1, 1) // Make it oval, rotated
    link2.position.set(0.8, 0, 0)
    link2.rotation.y = Math.PI / 2 // 90 degree rotation
    chainLinks.add(link2)

    scene.add(chainLinks)

    // Add environment map for realistic reflections
    const envTexture = new THREE.CubeTextureLoader().load([
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MGE1ZmEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MGE1ZmEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MGE1ZmEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MGE1ZmEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MGE1ZmEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MGE1ZmEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg=='
    ])
    scene.environment = envTexture
    chainMaterial.envMap = envTexture

    mountRef.current.appendChild(renderer.domElement)

    // Animation loop (smooth like Amp)
    let time = 0
    const animate = () => {
      time += 0.01

      if (chainLinksRef.current) {
        // Smooth floating rotation like Amp logo
        chainLinksRef.current.rotation.y = time * 0.5
        chainLinksRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
        chainLinksRef.current.position.y = Math.sin(time * 0.8) * 0.1

        // Individual link animations
        const links = chainLinksRef.current.children
        if (links[0]) {
          links[0].rotation.z = Math.sin(time * 0.7) * 0.1
        }
        if (links[1]) {
          links[1].rotation.z = Math.sin(time * 0.9) * 0.1
        }
      }

      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()
    setIsLoading(false)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [size])

  // Handle resize
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setSize(size, size)
    }
  }, [size])

  if (isLoading) {
    return (
      <div 
        className="bg-blue-600 rounded-lg flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg className="text-white animate-spin" width={size * 0.6} height={size * 0.6} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>
    )
  }

  return (
    <div 
      ref={mountRef}
      style={{ 
        width: size, 
        height: size,
        filter: `drop-shadow(0 ${size * 0.1}px ${size * 0.2}px rgba(37, 99, 235, 0.6))`
      }}
    />
  )
}
