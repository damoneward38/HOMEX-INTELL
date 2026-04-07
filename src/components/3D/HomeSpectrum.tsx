import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Text, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { 
  ShieldCheck, 
  Zap, 
  Thermometer, 
  Music, 
  Lightbulb, 
  Heart,
  Home
} from 'lucide-react';

const FeatureNode = ({ position, icon: Icon, label, color, rotationSpeed = 1 }: { position: [number, number, number], icon: any, label: string, color: string, rotationSpeed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * rotationSpeed;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[0.4, 32, 32]} ref={meshRef}>
          <MeshDistortMaterial
            color={color}
            speed={2}
            distort={0.3}
            radius={1}
          />
        </Sphere>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.2}
          color="white"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
};

const ConnectionLines = ({ nodes }: { nodes: [number, number, number][] }) => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        p.push(new THREE.Vector3(...nodes[i]));
        p.push(new THREE.Vector3(...nodes[j]));
      }
    }
    return p;
  }, [nodes]);

  return (
    <lineSegments>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#3b82f6" transparent opacity={0.1} />
    </lineSegments>
  );
};

const CentralCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group>
      <Sphere args={[1.2, 64, 64]} ref={meshRef}>
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.2}
        />
      </Sphere>
      <Sphere args={[0.8, 32, 32]}>
        <MeshDistortMaterial
          color="#6366f1"
          speed={3}
          distort={0.4}
          radius={1}
        />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={2} color="#3b82f6" />
    </group>
  );
};

export const HomeSpectrum = ({ enabledFeatures }: { enabledFeatures: string[] }) => {
  const features = [
    { id: 'security', label: 'Security', color: '#10b981', pos: [3, 1, 0] as [number, number, number] },
    { id: 'energy', label: 'Energy', color: '#eab308', pos: [-3, 1, 0] as [number, number, number] },
    { id: 'health', label: 'Health', color: '#ef4444', pos: [0, 3, 0] as [number, number, number] },
    { id: 'lighting', label: 'Lighting', color: '#facc15', pos: [2, -2, 2] as [number, number, number] },
    { id: 'music', label: 'Music', color: '#8b5cf6', pos: [-2, -2, 2] as [number, number, number] },
    { id: 'climate', label: 'Climate', color: '#3b82f6', pos: [0, -3, -2] as [number, number, number] },
  ].filter(f => enabledFeatures.includes(f.id));

  const nodePositions = features.map(f => f.pos);

  return (
    <div className="w-full h-[500px] glass rounded-3xl overflow-hidden relative border border-slate-800/50">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-xl font-black text-white tracking-tight">Intelligence Spectrum</h3>
        <p className="text-xs text-slate-400 font-medium">Real-time 3D system visualization</p>
      </div>
      
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

        <CentralCore />
        
        {features.map((f, i) => (
          <FeatureNode 
            key={f.id} 
            position={f.pos} 
            label={f.label} 
            color={f.color} 
            icon={null} 
            rotationSpeed={1 + i * 0.2}
          />
        ))}

        <ConnectionLines nodes={[[0, 0, 0], ...nodePositions]} />
        
        <gridHelper args={[20, 20, '#1e293b', '#0f172a']} position={[0, -5, 0]} />
      </Canvas>

      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        <div className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Interactive View
        </div>
        <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Live Data
        </div>
      </div>
    </div>
  );
};
