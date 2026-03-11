"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const LOGO_SVG = `
<svg viewBox="0 0 114 98" xmlns="http://www.w3.org/2000/svg">
  <path d="M62 69.5L82.5 32H110.5C113 32 114.229 34.6965 113 37L82.5 95.5C81.2292 97.6965 77.7292 98.1965 76 95L62 69.5Z" />
  <path d="M51.4814 69.5L30.9814 32H2.98143C0.481426 32 -0.747787 34.6965 0.481426 37L30.9814 95.5C32.2522 97.6965 35.7522 98.1965 37.4814 95L51.4814 69.5Z" />
  <path d="M52.4917 2.78507L36 29.8786L56.6146 66.9848L77.2292 29.8786L60.1485 2.78507C57.5 -0.928467 55 -0.928282 52.4917 2.78507Z" />
</svg>
`;

type Piece = {
  geometry: THREE.ExtrudeGeometry;
  position: [number, number, number];
  color: string;
  emissive: string;
};

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return coarse;
}

function LogoArtifact({ coarse }: { coarse: boolean }) {
  const root = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Group>(null);
  const cursor = useRef({ x: 0, y: 0 });

  const pieces = useMemo<Piece[]>(() => {
    const parsed = new SVGLoader().parse(LOGO_SVG);
    const baseColors = [
      { color: "#2f5f9f", emissive: "#326bc0" },
      { color: "#244574", emissive: "#2c5ca9" },
      { color: "#3d78bf", emissive: "#4f8ed8" },
    ];

    return parsed.paths.flatMap((path, pathIndex) =>
      SVGLoader.createShapes(path).map((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 10,
          bevelEnabled: true,
          bevelSegments: 5,
          steps: 1,
          bevelSize: 1.25,
          bevelThickness: 1.4,
          curveSegments: 18,
        });

        geometry.translate(-57, -49, -5);
        geometry.computeVertexNormals();

        return {
          geometry,
          position: [0, 0, pathIndex * 0.22] as [number, number, number],
          ...baseColors[pathIndex % baseColors.length],
        };
      }),
    );
  }, []);

  useEffect(() => {
    if (coarse) return;

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      cursor.current.x = x;
      cursor.current.y = y;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [coarse]);

  useFrame((state, delta) => {
    if (!root.current || !shell.current) return;

    const t = state.clock.elapsedTime;
    const targetX = coarse ? 0 : cursor.current.y * -0.16;
    const targetY = coarse ? 0 : cursor.current.x * 0.22;

    shell.current.rotation.x = THREE.MathUtils.damp(shell.current.rotation.x, targetX, 4.6, delta);
    shell.current.rotation.y = THREE.MathUtils.damp(shell.current.rotation.y, targetY, 4.6, delta);
    shell.current.position.x = THREE.MathUtils.damp(shell.current.position.x, coarse ? 0 : cursor.current.x * 0.18, 4, delta);
    shell.current.position.y = THREE.MathUtils.damp(
      shell.current.position.y,
      coarse ? 0 : cursor.current.y * -0.14,
      4,
      delta,
    );

    root.current.rotation.y = t * 0.28;
    root.current.rotation.z = Math.sin(t * 0.45) * 0.06;
    root.current.position.y = Math.sin(t * 0.7) * 0.16;
  });

  return (
    <group ref={shell}>
      <group ref={root} scale={0.058}>
        {pieces.map((piece, index) => (
          <mesh key={index} geometry={piece.geometry} position={piece.position} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={piece.color}
              metalness={0.72}
              roughness={0.28}
              clearcoat={0.9}
              clearcoatRoughness={0.18}
              reflectivity={0.7}
              envMapIntensity={0.85}
              sheen={0.35}
              sheenColor="#89b5ff"
              emissive={piece.emissive}
              emissiveIntensity={0.12}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function HeroLogo3D() {
  const coarse = useCoarsePointer();

  return (
    <div className="hero-logo-stage" aria-hidden="true">
      <Canvas
        dpr={coarse ? [1, 1.15] : [1, 1.6]}
        camera={{ position: [0, 0.25, 8.4], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.78} color="#afcffd" />
        <directionalLight position={[5, 6, 6]} intensity={2.2} color="#f7fbff" />
        <directionalLight position={[-6, -2, 4]} intensity={0.9} color="#6aa2ff" />
        <spotLight position={[0, 8, 2]} intensity={1.4} angle={0.42} penumbra={1} color="#b9d5ff" />
        <LogoArtifact coarse={coarse} />
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.34}
          scale={7}
          blur={2.6}
          far={6}
          resolution={512}
          color="#08101b"
        />
      </Canvas>
    </div>
  );
}
