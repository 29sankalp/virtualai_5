import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float, Sparkles, useAnimations } from "@react-three/drei";
import { useRef, useEffect } from "react";

function Robot() {
  const group = useRef();

  const { scene, animations } = useGLTF("/models/robot_playground.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      const firstAnimation = Object.values(actions)[0];
      firstAnimation?.play();
    }
  }, [actions]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.mouse.x * 0.6;
    group.current.rotation.x = state.mouse.y * 0.2;
  });

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={3}>
<primitive
  ref={group}
  object={scene}
  scale={1.0}
  position={[0, -1.8, 0]}
/>
    </Float>
  );
}

export default function Robot3D() {
  return (
    <Canvas camera={{ position: [1, 1, 5], fov: 45 }}>
      <color attach="background" args={["#081028"]} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <pointLight position={[2, 2, 2]} color="cyan" intensity={3} />
      <Sparkles count={100} scale={10} size={2} speed={0.5} />
      <Robot />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />
    </Canvas>
  );
}