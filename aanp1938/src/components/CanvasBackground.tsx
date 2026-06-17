"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Smooth noise functions
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for(int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.1 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // Slow temporal drift — like valley fog at 4am
    float t = uTime * 0.04;

    vec2 p = uv * 2.5;
    p += vec2(t * 0.3, t * 0.15);

    float f1 = fbm(p + fbm(p + fbm(p)));
    float f2 = fbm(p * 0.8 - vec2(t * 0.1, 0.0));

    float blend = mix(f1, f2, 0.45 + 0.1 * sin(t * 0.7));

    // Color palette: kathmandu-night to slate-himalaya with mustang-gold wisps
    vec3 night = vec3(0.043, 0.059, 0.098);     // #0B0F19
    vec3 himalaya = vec3(0.184, 0.212, 0.251);   // #2F3640
    vec3 gold = vec3(0.831, 0.686, 0.216);        // #D4AF37
    vec3 silk = vec3(0.973, 0.961, 0.941);        // #F8F5F0 — rare wisp

    // Base gradient: night at bottom, himalaya drifts
    vec3 col = mix(night, himalaya, blend * 0.6);

    // Gold wisps — rare, ephemeral, like fireflies or embers
    float wisp = pow(max(0.0, blend - 0.62), 3.0) * 2.5;
    float wispMask = smoothstep(0.0, 0.3, sin(uv.y * 3.0 + t * 1.2) * 0.5 + 0.5);
    col = mix(col, gold * 0.7, wisp * wispMask * 0.35);

    // Silk horizon — very faint luminance near the top
    float horizon = smoothstep(0.6, 1.0, uv.y) * 0.08;
    col = mix(col, silk, horizon);

    // Vignette
    vec2 vig = (uv - 0.5) * 2.0;
    float vignette = 1.0 - dot(vig, vig) * 0.3;
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function FluidPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  // Stable initial uniforms (safe to read during render). The per-frame time
  // update is applied via the material ref below, never by mutating this object
  // directly, which keeps the hook-purity lint rules satisfied.
  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (material) {
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={initialUniforms}
      />
    </mesh>
  );
}

export default function CanvasBackground() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[0.5, 1]}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
}
