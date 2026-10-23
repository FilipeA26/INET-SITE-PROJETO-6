import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Escala: 1 unidade = 100 mm. Medidas do HUAWEI WiFi AX2S: 205 x 120 x 39 mm (sem antenas).
const W = 2.05;
const D = 1.2;
const H_BACK = 0.39;
const H_FRONT = 0.1;

const WHITE = "#F3F5F8";
const SEAM = "#D9DEE6";
const ELECTRIC = "#0062EC";
const LIME = "#70E000";

/** Corpo em cunha: alto atrás e fino na frente, com cantos arredondados. */
function useBodyGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    // perfil lateral: x = profundidade (frente em +), y = altura
    s.moveTo(-D / 2, 0);
    s.lineTo(D / 2, 0);
    s.lineTo(D / 2, H_FRONT);
    s.lineTo(-D / 2, H_BACK);
    s.closePath();
    const bevel = 0.04;
    const g = new THREE.ExtrudeGeometry(s, { depth: W - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 6, curveSegments: 12 });
    // a extrusão vira a largura (eixo X) e o perfil fica de lado
    g.rotateY(-Math.PI / 2);
    g.translate(W / 2 - bevel, 0, 0);
    g.computeVertexNormals();
    return g;
  }, []);
}

/** Antena chata, um pouco mais larga no alto, presa por uma dobradiça. */
function Antenna({ x, tilt }: { x: number; tilt: number }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.1, 0);
    s.lineTo(0.1, 0);
    s.lineTo(0.12, 1.55);
    s.quadraticCurveTo(0.12, 1.62, 0.06, 1.62);
    s.lineTo(-0.06, 1.62);
    s.quadraticCurveTo(-0.12, 1.62, -0.12, 1.55);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3 });
    g.translate(0, 0, -0.015);
    return g;
  }, []);
  return (
    <group position={[x, H_BACK - 0.02, -D / 2 - 0.02]}>
      {/* dobradiça */}
      <RoundedBox args={[0.18, 0.12, 0.12]} radius={0.03} smoothness={3} position={[0, 0.02, 0]}>
        <meshStandardMaterial color={SEAM} roughness={0.5} />
      </RoundedBox>
      <group position={[0, 0.06, 0]} rotation={[-0.06, 0, tilt]}>
        <mesh geometry={geo}>
          <meshPhysicalMaterial color={WHITE} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

const Z_H = -0.18;

/** Botão H no tampo (WPS / HUAWEI Share), em baixo relevo. */
function HButton() {
  return (
    // o tampo é inclinado: o botão acompanha a rampa da cunha (+ 0,04 do chanfro)
    <group position={[0, H_BACK - ((Z_H + D / 2) / D) * (H_BACK - H_FRONT) + 0.043, Z_H]}>
      <group rotation={[Math.atan2(H_BACK - H_FRONT, D), 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.1, 40]} />
          <meshStandardMaterial color={SEAM} roughness={0.6} />
        </mesh>
        {[[-0.03, 0, 0.012, 0.09], [0.03, 0, 0.012, 0.09], [0, 0, 0.06, 0.012]].map(([x, z, w, d], i) => (
          <mesh key={i} position={[x, 0.002, z]}>
            <boxGeometry args={[w, 0.004, d]} />
            <meshStandardMaterial color="#8A94A6" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** LED frontal único, que respira em verde-lima. */
function Led() {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (mat.current) mat.current.emissiveIntensity = 1.2 + Math.sin(clock.elapsedTime * 2.2) * 0.8;
  });
  return (
    <mesh position={[0, H_FRONT * 0.45, D / 2 + 0.035]}>
      <sphereGeometry args={[0.018, 16, 16]} />
      <meshStandardMaterial ref={mat} color={LIME} emissive={LIME} emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
  );
}

/** Ondas de sinal que saem do roteador. */
function Waves() {
  const rings = useRef<THREE.Mesh[]>([]);
  const geo = useMemo(() => new THREE.TorusGeometry(1, 0.01, 8, 96, Math.PI * 0.7), []);
  useFrame(({ clock }) => {
    rings.current.forEach((r, i) => {
      if (!r) return;
      const t = (clock.elapsedTime * 0.35 + i / 3) % 1;
      r.scale.setScalar(1.4 + t * 2.2);
      (r.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.45;
    });
  });
  return (
    <group position={[0, 1.3, -0.6]} rotation={[0, 0, Math.PI * 0.15]}>
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
  const body = useBodyGeometry();
  useFrame(({ clock }) => {
    if (g.current) g.current.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.04;
  });
  return (
    <group ref={g} rotation={[0, -0.55, 0]}>
      <mesh geometry={body}>
        <meshPhysicalMaterial color={WHITE} roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.25} />
      </mesh>
      {/* base escura levemente recuada, como a sola do aparelho */}
      <mesh position={[0, -0.035, 0]}>
        <boxGeometry args={[W - 0.12, 0.012, D - 0.12]} />
        <meshStandardMaterial color="#C9D0DA" roughness={0.8} />
      </mesh>
      {/* portas na traseira: 4 Gigabit WAN/LAN + energia */}
      {[-0.55, -0.3, -0.05, 0.2, 0.55].map((x, i) => (
        <mesh key={x} position={[x, 0.16, -D / 2 - 0.041]}>
          <boxGeometry args={i === 4 ? [0.09, 0.09, 0.01] : [0.17, 0.13, 0.01]} />
          <meshStandardMaterial color="#1A2233" roughness={0.6} />
        </mesh>
      ))}
      <HButton />
      <Led />
      {/* filete de assinatura no canto direito da frente (sem reproduzir o logotipo) */}
      <mesh position={[0.72, H_FRONT * 0.45, D / 2 + 0.034]}>
        <boxGeometry args={[0.22, 0.012, 0.004]} />
        <meshStandardMaterial color="#B8C0CC" />
      </mesh>
      <Antenna x={-0.78} tilt={0.03} />
      <Antenna x={-0.26} tilt={0.01} />
      <Antenna x={0.26} tilt={-0.01} />
      <Antenna x={0.78} tilt={-0.03} />
      <Waves />
    </group>
  );
}

/** Cena 3D do HUAWEI WiFi AX2S. Arrastar gira; sem zoom para não brigar com a rolagem. */
export default function Wifi6Router3D({ onError }: { onError?: () => void }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [3.6, 2.6, 4.4], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () => onError?.(), { once: true });
      }}
      className="!cursor-grab active:!cursor-grabbing"
    >
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#DCE8FF", "#010818", 0.6]} />
      <directionalLight position={[4, 6, 3]} intensity={2} />
      <pointLight position={[-3, 1.5, 2]} intensity={12} color={ELECTRIC} />
      <pointLight position={[2.5, 1, -3]} intensity={8} color={LIME} />
      <Router />
      <ContactShadows position={[0, -0.045, 0]} opacity={0.6} scale={7} blur={2.4} far={2} color="#000000" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.9}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.48}
        target={[0, 0.7, 0]}
      />
    </Canvas>
  );
}
