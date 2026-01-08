
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, Stars, Cloud, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  weatherCode: number;
  windSpeed?: number;
}

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

  const windDrift = (windSpeed / 50) * 0.3;
  const particleCount = isRainy ? 5000 : isSnowy ? 3000 : isClear ? 200 : 1000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
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
        array[idx + 1] -= 0.6 + (windSpeed / 80); 
      } else if (isSnowy) {
        array[idx + 1] -= 0.04 + (Math.sin(time + i) * 0.01);
        array[idx] += Math.sin(time * 0.5 + i) * 0.03;
        array[idx + 2] += Math.cos(time * 0.3 + i) * 0.02;
      } else {
        array[idx + 1] -= 0.01;
      }

      array[idx] += windDrift;

      if (array[idx + 1] < -2) {
        array[idx + 1] = 28;
        array[idx] = (Math.random() - 0.5) * 60;
      }
      
      if (array[idx] > 30) array[idx] = -30;
      if (array[idx] < -30) array[idx] = 30;
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
          size={isSnowy ? 0.25 : isRainy ? 0.06 : 0.04}
          color={isRainy ? "#94a3b8" : isSnowy ? "#ffffff" : "#fbbf24"}
          transparent
          opacity={isSnowy ? 0.8 : 0.6}
          map={isSnowy ? snowflakeTexture : null}
          alphaTest={0.01}
          depthWrite={false}
          blending={isSnowy ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
      
      {isRainy || isStormy ? (
        <fog attach="fog" args={['#1e293b', 1, 35]} />
      ) : isSnowy ? (
        <fog attach="fog" args={['#334155', 1, 40]} />
      ) : (
        <fog attach="fog" args={['#0c4a6e', 1, 60]} />
      )}
    </>
  );
};

const Landscape = ({ scrollOffset }: { scrollOffset: React.MutableRefObject<number> }) => {
  const landscapeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (landscapeRef.current) {
      // Subtle rotation and downward movement for parallax
      landscapeRef.current.position.y = -1 - (scrollOffset.current * 0.002);
      landscapeRef.current.rotation.x = -Math.PI / 2 - (scrollOffset.current * 0.0001);
    }
  });

  return (
    <mesh ref={landscapeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial color="#064e3b" roughness={0.9} />
    </mesh>
  );
};

const DynamicAtmosphere = ({ weatherCode, windSpeed = 10 }: Props) => {
  const currentHour = new Date().getHours();
  const isNight = currentHour > 19 || currentHour < 6;
  const isSunrise = currentHour >= 5 && currentHour <= 7;
  const isSunset = currentHour >= 18 && currentHour <= 20;
  
  const isCloudy = weatherCode > 3;
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
  
  const getBaseOpacity = () => {
    if (isStormy) return 0.85;
    if (isRainy) return 0.75;
    if (isCloudy) return 0.6;
    if (weatherCode >= 1 && weatherCode <= 3) return 0.25;
    return 0.1;
  };

  const getCloudColor = () => {
    if (isStormy) return "#2d3748";
    if (isRainy) return "#94a3b8";
    if (isSunrise) return "#fed7aa";
    if (isSunset) return "#fecaca";
    if (isNight) return "#1e293b";
    return "#ffffff";
  };
  
  const baseOpacity = getBaseOpacity();
  const cloudColor = getCloudColor();
  const windIntensity = Math.min(windSpeed / 40, 3.5);
  const timeFactor = isNight ? 0.6 : 1.0;
  const floatSpeed = (isCloudy ? 1.0 + windIntensity : 0.8) * timeFactor;
  const cloudSpeed = (0.15 + (windIntensity * 0.5)) * timeFactor;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollVal = scrollOffset.current;

    // Camera Parallax
    state.camera.position.y = 3 - (scrollVal * 0.005);
    state.camera.rotation.x = - (scrollVal * 0.0002);
    
    if (cloudGroupRef.current) {
      cloudGroupRef.current.position.x = Math.sin(time * 0.12 * (1 + windIntensity)) * 10;
      cloudGroupRef.current.position.y = 12 - (scrollVal * 0.012);
      
      const shapePulse = Math.sin(time * 0.2 + (windIntensity * 0.5)) * 0.05;
      cloudGroupRef.current.scale.set(1 + shapePulse, 1 - shapePulse, 1 + shapePulse * 0.5);
      cloudGroupRef.current.rotation.y = Math.sin(time * 0.05) * 0.1;

      if (windSpeed > 25) {
        cloudGroupRef.current.position.y += Math.sin(time * 2.5) * (windIntensity * 0.25);
        cloudGroupRef.current.rotation.z = Math.sin(time * 1.5) * 0.08 * windIntensity;
      }
    }

    if (sunLightRef.current) {
      const sunBaseIntensity = isNight ? 0.1 : 1.4;
      const cloudDimming = isCloudy || isRainy ? 0.35 : (weatherCode > 0 ? 0.8 : 1.0);
      const stormFlicker = isStormy ? (Math.random() > 0.985 ? 3.5 : 1) : 1;
      
      sunLightRef.current.intensity = (sunBaseIntensity + Math.sin(time * 0.3) * 0.1) * cloudDimming * stormFlicker;
      
      const sunX = 120 * Math.cos(time * 0.008);
      const sunZ = 120 * Math.sin(time * 0.008);
      sunLightRef.current.position.set(sunX, 45, sunZ);
    }
  });

  return (
    <>
      <ambientLight intensity={isNight ? 0.1 : 0.5} />
      <directionalLight ref={sunLightRef} position={[100, 40, 100]} castShadow />
      
      {isNight ? (
        <Stars radius={120} depth={60} count={7500} factor={6} saturation={0} fade speed={1.8} />
      ) : (
        <Sky 
          sunPosition={[100, 20, 100]} 
          turbidity={isCloudy ? 15 : 0.05}
          rayleigh={isCloudy ? 6 : 0.4}
          mieCoefficient={isCloudy ? 0.15 : 0.005}
          mieDirectionalG={0.9}
        />
      )}

      <group ref={cloudGroupRef} position={[0, 12, -15]}>
        <Float speed={floatSpeed} rotationIntensity={0.8} floatIntensity={1.5}>
          <Cloud 
            opacity={baseOpacity} 
            speed={cloudSpeed} 
            width={16} 
            depth={3} 
            segments={28} 
            position={[-12, 0, 0]} 
            color={cloudColor}
          />
          <Cloud 
            opacity={baseOpacity * 0.95} 
            speed={cloudSpeed * 0.85} 
            width={24} 
            depth={5} 
            segments={35} 
            position={[15, -4, -12]} 
            color={cloudColor}
          />
          <Cloud 
            opacity={baseOpacity * 0.8} 
            speed={cloudSpeed * 1.2} 
            width={18} 
            depth={4} 
            segments={22} 
            position={[-4, 5, -25]} 
            color={cloudColor}
          />
        </Float>
      </group>

      <WeatherEffects weatherCode={weatherCode} windSpeed={windSpeed} />
      <Landscape scrollOffset={scrollOffset} />
      
      {(!isCloudy && !isNight) && (
        <Sparkles 
          count={120} 
          scale={45} 
          size={5} 
          speed={0.4 + (windIntensity * 0.3)} 
          color={isSunset || isSunrise ? "#fb923c" : "#fef08a"} 
        />
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
