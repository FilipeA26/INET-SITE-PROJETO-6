import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Cores do manual da marca
const NAVY = "#03256C";
const ROYAL = "#003F99";
const ELECTRIC = "#0062EC";
const LIME = "#70E000";

/** Antena articulada na traseira do roteador. */
function Antenna({ x, tilt }: { x: number; tilt: number }) {
  return (
    <group position={[x, 0.22, -0.78]} rotation={[-0.12, 0, tilt]}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.14, 24]} />
        <meshStandardMaterial color={ROYAL} metalness={0.4} roughness={0.35} />
      </mesh>
      <RoundedBox args={[0.16, 1.5, 0.06]} radius={0.03} smoothness={4} position={[0, 0.85, 0]}>
        <meshStandardMaterial color={NAVY} metalness={0.25} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 1.45, 0.035]}>
        <boxGeometry args={[0.06, 0.18, 0.01]} />
        <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

/** LEDs frontais que pulsam em sequência. */
function Leds() {
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  useFrame(({ clock }) => {
    mats.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = 0.6 + 1.6 * Math.max(0, Math.sin(clock.elapsedTime * 2.4 - i * 0.7));
    });
  });
  return (
    <group position={[-0.55, 0.02, 0.86]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[i * 0.18, 0, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial ref={(m) => { if (m) mats.current[i] = m; }} color={LIME} emissive={LIME} emissiveIntensity={1} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Ondas de sinal que saem do roteador. */
function Waves() {
  const rings = useRef<THREE.Mesh[]>([]);
  const geo = useMemo(() => new THREE.TorusGeometry(1, 0.012, 8, 96, Math.PI * 0.7), []);
  useFrame(({ clock }) => {
    rings.current.forEach((r, i) => {
      if (!r) return;
      const t = (clock.elapsedTime * 0.35 + i / 3) % 1;
      r.scale.setScalar(1.2 + t * 2.2);
      (r.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.55;
    });
  });
  return (
    <group position={[0, 0.6, 0]} rotation={[0, 0, Math.PI * 0.15]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { if (m) rings.current[i] = m; }} geometry={geo}>
          <meshBasicMaterial color={LIME} transparent opacity={0.4} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Router() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.05;
  });
  return (
    <group ref={g} rotation={[0.12, -0.5, 0]}>
      {/* corpo */}
      <RoundedBox args={[2.2, 0.38, 1.7]} radius={0.16} smoothness={6}>
        <meshPhysicalMaterial color={NAVY} metalness={0.3} roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
      </RoundedBox>
      {/* tampo com faixa em azul elétrico */}
      <RoundedBox args={[1.9, 0.04, 1.4]} radius={0.02} smoothness={4} position={[0, 0.19, 0]}>
        <meshStandardMaterial color={ROYAL} metalness={0.5} roughness={0.4} />
      </RoundedBox>
      {/* grade de ventilação */}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-0.72 + i * 0.18, 0.215, -0.1]}>
          <boxGeometry args={[0.07, 0.01, 0.9]} />
          <meshStandardMaterial color="#010818" roughness={0.9} />
        </mesh>
      ))}
      {/* friso de luz frontal */}
      <mesh position={[0, -0.12, 0.851]}>
        <boxGeometry args={[1.6, 0.02, 0.01]} />
        <meshStandardMaterial color={ELECTRIC} emissive={ELECTRIC} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <Leds />
      {/* pés */}
      {[[-0.85, -0.6], [0.85, -0.6], [-0.85, 0.6], [0.85, 0.6]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -0.21, z]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#010818" />
        </mesh>
      ))}
      <Antenna x={-0.8} tilt={0.18} />
      <Antenna x={-0.27} tilt={0.06} />
      <Antenna x={0.27} tilt={-0.06} />
      <Antenna x={0.8} tilt={-0.18} />
      <Waves />
    </group>
  );
}

/** Cena 3D do roteador Wi-Fi 6. Arrastar gira; sem zoom para não brigar com a rolagem. */
export default function Wifi6Router3D({ onError }: { onError?: () => void }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [3.4, 2.2, 4.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () => onError?.(), { once: true });
      }}
      className="!cursor-grab active:!cursor-grabbing"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 3]} intensity={2.2} />
      <pointLight position={[-3, 1.5, 2]} intensity={14} color={ELECTRIC} />
      <pointLight position={[2, 0.5, -3]} intensity={10} color={LIME} />
      <Router />
      <ContactShadows position={[0, -0.32, 0]} opacity={0.55} scale={7} blur={2.6} far={2} color="#000000" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.9}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.48}
        target={[0, 0.5, 0]}
      />
    </Canvas>
  );
}
