import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Float, Text, MeshDistortMaterial, PerspectiveCamera, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

interface NodeProps {
  position: [number, number, number];
  label: string;
  color: string;
  active?: boolean;
}

const Node: React.FC<NodeProps> = ({ position, label, color, active }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={active ? '#fff' : color} 
          emissive={color} 
          emissiveIntensity={active ? 2 : 0.5} 
          toneMapped={false}
        />
        <pointLight intensity={active ? 2 : 0.5} distance={3} color={color} />
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
        >
          {label}
        </Text>
      </mesh>
    </Float>
  );
};

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  active?: boolean;
}

const Edge: React.FC<EdgeProps> = ({ start, end, active }) => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]);
  }, [start, end]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 20, 0.05, 8, false]} />
      <meshStandardMaterial 
        color={active ? '#818cf8' : '#1e293b'} 
        emissive={active ? '#818cf8' : '#000'}
        emissiveIntensity={active ? 1 : 0}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

const SortingBars3D = ({ data }: { data: number[] }) => {
  return (
    <group position={[-data.length / 2, 0, 0]}>
      {data.map((val, i) => (
        <mesh key={i} position={[i * 1.2, val / 20, 0]}>
          <boxGeometry args={[0.8, val / 10, 0.8]} />
          <meshStandardMaterial 
            color="#818cf8" 
            emissive="#818cf8"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

const AlgorithmScene = ({ algoName }: { algoName: string }) => {
  const name = algoName.toLowerCase();

  // Sorting: 3D Bars
  if (name.includes('sort')) {
    const data = [40, 70, 30, 90, 50, 80, 20, 60, 45, 85];
    return <SortingBars3D data={data} />;
  }

  // Graph Algos: Floating 3D Network
  const nodes: NodeProps[] = [
    { position: [0, 0, 0], label: 'Root', color: '#6366f1', active: true },
    { position: [-3, 2, -2], label: 'Node A', color: '#ec4899' },
    { position: [3, 2, 2], label: 'Node B', color: '#10b981' },
    { position: [-2, -3, 1], label: 'Node C', color: '#f59e0b' },
    { position: [4, -2, -3], label: 'Node D', color: '#3b82f6' },
  ];

  return (
    <group>
      {nodes.map((node, i) => (
        <Node key={i} {...node} />
      ))}
      <Edge start={[0, 0, 0]} end={[-3, 2, -2]} active />
      <Edge start={[0, 0, 0]} end={[3, 2, 2]} />
      <Edge start={[-3, 2, -2]} end={[-2, -3, 1]} active />
      <Edge start={[3, 2, 2]} end={[4, -2, -3]} />
    </group>
  );
};

export default function ThreeDVisualizer({ algoName }: { algoName: string }) {
  return (
    <div className="w-full h-full min-h-[500px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl">
      <div className="absolute top-6 left-6 z-10">
        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> 3D Spatial Engine
        </h4>
        <p className="text-slate-400 text-[10px]">Interact with the graph using your mouse</p>
      </div>

      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

        <PresentationControls
          global
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <AlgorithmScene algoName={algoName} />
        </PresentationControls>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#020617" 
            transparent 
            opacity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Canvas>
    </div>
  );
}
