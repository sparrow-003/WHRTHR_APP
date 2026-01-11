
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, Stars, Cloud, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  weatherCode: number;
  windSpeed?: number;
}

// ... (imports remain the same)

const WeatherEffects = ({ weatherCode, windSpeed = 10 }: Props) => {
  const particlesRef = useRef<THREE.Points>(null);

  const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isSnowy = weatherCode >= 71 && weatherCode <= 77;
  const isClear = weatherCode === 0 || weatherCode === 1;
  const isStormy = weatherCode >= 95;

  const snowflakeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (!context) return null;

    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.2)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }, []);

  const windDrift = (windSpeed / 50) * 0.5; // Increased drift for realism
  const particleCount = isRainy ? 8000 : isSnowy ? 4000 : isClear ? 300 : 1500; // Increased counts

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80; // Wider area
      pos[i * 3 + 1] = Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, [particleCount]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    const array = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;

      if (isRainy) {
        array[idx + 1] -= 0.8 + (windSpeed / 60) + Math.random() * 0.1; // Faster, varied rain
        array[idx] += windDrift;
      } else if (isSnowy) {
        array[idx + 1] -= 0.05 + (Math.sin(time + i) * 0.02);
        array[idx] += Math.sin(time * 0.5 + i) * 0.05 + windDrift; // More swirl
        array[idx + 2] += Math.cos(time * 0.3 + i) * 0.03;
      } else {
        // Floating particles (dust/pollen)
        array[idx + 1] -= 0.02;
        array[idx] += Math.sin(time * 0.1 + i) * 0.01;
      }

      // Reset positions
      if (array[idx + 1] < -10) {
        array[idx + 1] = 30;
        array[idx] = (Math.random() - 0.5) * 80;
        array[idx + 2] = (Math.random() - 0.5) * 80;
      }

      if (array[idx] > 40) array[idx] = -40;
      if (array[idx] < -40) array[idx] = 40;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isSnowy ? 0.3 : isRainy ? 0.08 : 0.06}
          // Yellow/Blue theme colors
          color={isRainy ? "#60a5fa" : isSnowy ? "#ffffff" : "#fcd34d"}
          transparent
          opacity={isSnowy ? 0.9 : isRainy ? 0.7 : 0.8}
          map={isSnowy ? snowflakeTexture : null}
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {isRainy || isStormy ? (
        <fog attach="fog" args={['#1e3a8a', 2, 45]} /> // Dark Blue Fog
      ) : isSnowy ? (
        <fog attach="fog" args={['#cbd5e1', 2, 50]} /> // White/Grey Fog
      ) : (
        <fog attach="fog" args={['#3b82f6', 5, 80]} /> // Bright Blue Fog
      )}
    </>
  );
};

const Landscape = ({ scrollOffset }: { scrollOffset: React.MutableRefObject<number> }) => {
  const landscapeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (landscapeRef.current) {
      landscapeRef.current.position.y = -2 - (scrollOffset.current * 0.002);
      landscapeRef.current.rotation.x = -Math.PI / 2 - (scrollOffset.current * 0.0001);
    }
  });

  return (
    <mesh ref={landscapeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial color="#1e40af" roughness={0.8} metalness={0.2} />
    </mesh>
  );
};

const DynamicAtmosphere = ({ weatherCode, windSpeed = 10 }: Props) => {
  const currentHour = new Date().getHours();
  const isNight = currentHour > 19 || currentHour < 6;
  const isSunrise = currentHour >= 5 && currentHour <= 7;
  const isSunset = currentHour >= 18 && currentHour <= 20;

  const isCloudy = weatherCode >= 2;
  const isStormy = weatherCode >= 95;
  const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);

  const cloudGroupRef = useRef<THREE.Group>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const scrollOffset = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollOffset.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getCloudColor = () => {
    if (isStormy) return "#1e3a8a"; // Dark Blue
    if (isRainy) return "#93c5fd"; // Light Blue
    if (isSunrise) return "#fde047"; // Yellow
    if (isSunset) return "#bfdbfe"; // Soft Blue
    if (isNight) return "#172554"; // Very Dark Blue
    return "#ffffff"; // White
  };

  const cloudColor = getCloudColor();

  // Adjusted animation logic
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollVal = scrollOffset.current;

    state.camera.position.y = 3 - (scrollVal * 0.005);

    if (cloudGroupRef.current) {
      cloudGroupRef.current.position.x = Math.sin(time * 0.05) * 5;
      cloudGroupRef.current.rotation.y = time * 0.02;
    }

    if (sunLightRef.current) {
      sunLightRef.current.position.set(50, 50, 50);
      sunLightRef.current.intensity = isNight ? 0.2 : 1.5;
    }
  });

  return (
    <>
      <ambientLight intensity={isNight ? 0.2 : 0.6} />
      <directionalLight ref={sunLightRef} position={[50, 50, 50]} castShadow />

      {isNight ? (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      ) : (
        <Sky
          sunPosition={[100, 40, 100]}
          turbidity={10}
          rayleigh={2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
      )}

      <group ref={cloudGroupRef} position={[0, 10, -20]}>
        <Cloud opacity={0.6} speed={0.4} width={20} depth={5} segments={20} color={cloudColor} />
      </group>

      <WeatherEffects weatherCode={weatherCode} windSpeed={windSpeed} />
      <Landscape scrollOffset={scrollOffset} />

      {!isNight && !isRainy && (
        <Sparkles count={100} scale={40} size={6} speed={0.4} opacity={0.5} color="#facc15" />
      )}
    </>
  );
};

export default function ThreeDBackground({ weatherCode, windSpeed }: Props) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas shadows camera={{ position: [0, 3, 18], fov: 42 }}>
        <DynamicAtmosphere weatherCode={weatherCode} windSpeed={windSpeed} />
      </Canvas>
    </div>
  );
}
