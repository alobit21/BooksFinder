"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import React, { useEffect, useRef } from "react"
import * as THREE from "three"

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref">

export function DottedSurfaceThree({ className, ...props }: DottedSurfaceProps) {
  const { resolvedTheme } = useTheme()

  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    if (!width || !height) return // ✅ prevents invisible canvas bug

    const SEPARATION = 80
    const AMOUNTX = 50
    const AMOUNTY = 40

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
    camera.position.set(0, 200, 800)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)

    containerRef.current.appendChild(renderer.domElement)

    // Geometry
    const geometry = new THREE.BufferGeometry()
    const positions: number[] = []
    const colors: number[] = []

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2
        const y = 0
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2

        positions.push(x, y, z)

        // ✅ Correct theme handling
        if (resolvedTheme === "dark") {
          colors.push(120, 160, 255)
        } else {
          colors.push(20, 20, 20)
        }
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    )

    // ✅ Fixed: use resolvedTheme everywhere
    const material = new THREE.PointsMaterial({
      size: 14,
      vertexColors: true,
      transparent: true,
      opacity: resolvedTheme === "dark" ? 0.6 : 1,
    })

    // Optional glow in dark mode
    if (resolvedTheme === "dark") {
      material.blending = THREE.AdditiveBlending
    }

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let count = 0
    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const positions = geometry.attributes.position.array as Float32Array

      let i = 0
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3

          positions[index + 1] =
            Math.sin((ix + count) * 0.3) * 30 +
            Math.sin((iy + count) * 0.5) * 30

          i++
        }
      }

      geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      count += 0.08
    }

    const handleResize = () => {
      if (!containerRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      if (!width || !height) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    animate()

    sceneRef.current = {
      scene,
      camera,
      renderer,
      animationId,
    }

    return () => {
      window.removeEventListener("resize", handleResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        sceneRef.current.scene.traverse((obj) => {
          if (obj instanceof THREE.Points) {
            obj.geometry.dispose()
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose())
            } else {
              obj.material.dispose()
            }
          }
        })

        sceneRef.current.renderer.dispose()

        if (
          containerRef.current &&
          sceneRef.current.renderer.domElement &&
          containerRef.current.contains(
            sceneRef.current.renderer.domElement
          )
        ) {
          containerRef.current.removeChild(
            sceneRef.current.renderer.domElement
          )
        }
      }
    }
  }, [resolvedTheme]) // ✅ FIXED dependency

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 w-full h-full",
        className
      )}
      {...props}
    />
  )
}