'use client';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurfaceThree({ className, ...props }: DottedSurfaceProps) {
	const { theme } = useTheme();

	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
	} | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		console.log('DottedSurfaceThree: Initializing...');

		const SEPARATION = 80;
		const AMOUNTX = 50;
		const AMOUNTY = 40;

		// Scene setup
		const scene = new THREE.Scene();
		// Remove fog for better visibility

		const camera = new THREE.PerspectiveCamera(
			60,
			containerRef.current.clientWidth / containerRef.current.clientHeight,
			1,
			10000,
		);
		camera.position.set(0, 200, 800);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
		renderer.setClearColor(0x000000, 0); // Transparent background

		containerRef.current.appendChild(renderer.domElement);

		console.log('DottedSurfaceThree: Renderer appended to DOM');

		// Create particles
		const particles: THREE.Points[] = [];
		const positions: number[] = [];
		const colors: number[] = [];

		// Create geometry for all particles
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				if (theme === 'dark') {
					colors.push(100, 100, 255); // Blue for dark theme
				} else {
					colors.push(255, 100, 100); // Red for light theme
				}
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		// Create material
		const material = new THREE.PointsMaterial({
			size: 12,
			vertexColors: true,
			transparent: true,
			opacity: 1.0,
			sizeAttenuation: true,
		});

		// Create points object
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId: number = 0;

		// Animation function
		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const positionAttribute = geometry.attributes.position;
			const positions = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;

					// Animate Y position with sine waves
					positions[index + 1] =
						Math.sin((ix + count) * 0.3) * 30 +
						Math.sin((iy + count) * 0.5) * 30;

					i++;
				}
			}

			positionAttribute.needsUpdate = true;

			// Update point sizes based on wave
			const customMaterial = material as THREE.PointsMaterial & {
				uniforms?: any;
			};
			if (!customMaterial.uniforms) {
				// For dynamic size changes, we'd need a custom shader
				// For now, keeping constant size for performance
			}

			renderer.render(scene, camera);
			count += 0.1;

			// Store references after first animation frame
			if (sceneRef.current === null) {
				sceneRef.current = {
					scene,
					camera,
					renderer,
					particles: [points],
					animationId,
					count,
				};
			}
		};

		// Handle window resize
		const handleResize = () => {
			if (containerRef.current) {
				camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
			}
		};

		window.addEventListener('resize', handleResize);

		// Start animation
		animate();

		// Cleanup function
		return () => {
			window.removeEventListener('resize', handleResize);

			if (sceneRef.current) {
				cancelAnimationFrame(sceneRef.current.animationId);

				// Clean up Three.js objects
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((material) => material.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {
					containerRef.current.removeChild(
						sceneRef.current.renderer.domElement,
					);
				}
			}
		};
	}, [theme]);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0 z-0 bg-red-500/20', className)}
			{...props}
		/>
	);
}
