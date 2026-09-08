"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { motionState } from "./motionState";
import {
  particleVertex,
  particleFragment,
  screenVertex,
  screenFragment,
  wireVertex,
  wireFragment,
} from "./shaders";

function Scene() {
  const points = useRef<THREE.Points>(null);
  const particleMaterial = useRef<THREE.ShaderMaterial>(null);
  const screenMaterial = useRef<THREE.ShaderMaterial>(null);
  const wireMaterial = useRef<THREE.ShaderMaterial>(null);
  const wire = useRef<THREE.Mesh>(null);
  const { invalidate, gl } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(-10, -10) },
      uVelocity: { value: 0 },
    }),
    [],
  );
  const screen = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(-10, -10) },
      uTrail: { value: new THREE.Vector2(-10, -10) },
      uSpeed: { value: 0 },
      uAspect: { value: 1 },
    }),
    [],
  );
  const wireUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 0 },
      uOpacity: { value: 0 },
    }),
    [],
  );
  const data = useMemo(() => {
    const positions = new Float32Array(650 * 3),
      seeds = new Float32Array(650);
    for (let i = 0; i < 650; i++) {
      const seed = ((i * 7919) % 65521) / 65521;
      positions[i * 3] = (seed - 0.5) * 12;
      positions[i * 3 + 1] = (((i * 3571) % 8191) / 8191 - 0.5) * 8;
      positions[i * 3 + 2] = (((i * 2377) % 4093) / 4093 - 0.5) * 3;
      seeds[i] = seed;
    }
    return { positions, seeds };
  }, []);
  useEffect(() => {
    // Render at 30fps and suspend completely in hidden tabs.
    const timer = window.setInterval(() => {
      if (!document.hidden) invalidate();
    }, 1000 / 30);
    const lost = (event: Event) => {
      event.preventDefault();
      window.dispatchEvent(new Event("cinema-webgl-lost"));
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      clearInterval(timer);
      gl.domElement.removeEventListener("webglcontextlost", lost);
    };
  }, [invalidate, gl]);
  useFrame(({ clock, viewport, size }) => {
    if (
      !particleMaterial.current ||
      !screenMaterial.current ||
      !wireMaterial.current
    )
      return;
    const uniforms = particleMaterial.current.uniforms;
    const screen = screenMaterial.current.uniforms;
    const wireUniforms = wireMaterial.current.uniforms;
    const t = clock.elapsedTime;
    uniforms.uTime.value = t;
    uniforms.uPointer.value.set(
      (motionState.x - 0.5) * viewport.width,
      (0.5 - motionState.y) * viewport.height,
    );
    uniforms.uVelocity.value = motionState.speed;
    screen.uTime.value = t;
    screen.uAspect.value = size.width / size.height;
    screen.uPointer.value.lerp(
      new THREE.Vector2(motionState.x, 1 - motionState.y),
      0.3,
    );
    screen.uTrail.value.lerp(screen.uPointer.value, 0.12);
    screen.uSpeed.value = motionState.speed;
    wireUniforms.uTime.value = t;
    wireUniforms.uSpeed.value = motionState.speed;
    wireUniforms.uOpacity.value = motionState.about;
    if (points.current) points.current.visible = motionState.hero > 0;
    if (wire.current) {
      wire.current.visible = motionState.about > 0.01;
      wire.current.rotation.set(t * 0.07, t * 0.1, 0);
      wire.current.position.x = viewport.width * 0.24;
    }
    if (!motionState.ready) {
      motionState.ready = true;
      requestAnimationFrame(() =>
        window.dispatchEvent(new Event("cinema-webgl-ready")),
      );
    }
  });
  return (
    <>
      <points ref={points} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
          />
          <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={particleMaterial}
          uniforms={uniforms}
          vertexShader={particleVertex}
          fragmentShader={particleFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.7, 2]} />
        <shaderMaterial
          ref={wireMaterial}
          uniforms={wireUniforms}
          vertexShader={wireVertex}
          fragmentShader={wireFragment}
          wireframe
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh frustumCulled={false} renderOrder={10}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={screenMaterial}
          uniforms={screen}
          vertexShader={screenVertex}
          fragmentShader={screenFragment}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
export default function FilmScene() {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      fallback={null}
    >
      <Scene />
    </Canvas>
  );
}
