import { Bounds, ContactShadows, OrbitControls, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { useStairStore } from '../configurator/store'

function StairModel() {
  const params = useStairStore((state) => state.params)
  const stepCount = Math.max(1, Math.round(params.totalHeight / params.stepHeight))
  const stepDepth = params.totalLength / stepCount / 1000
  const stepRise = params.totalHeight / stepCount / 1000
  const width = params.width / 1000

  const steps = useMemo(
    () =>
      Array.from({ length: stepCount }, (_, index) => ({
        x: index * stepDepth,
        y: index * stepRise,
        z: 0,
      })),
    [stepCount, stepDepth, stepRise],
  )

  return (
    <group position={[-(stepCount * stepDepth) / 2, -0.8, 0]}>
      {steps.map((step, index) => (
        <mesh key={`${step.x}-${index}`} position={[step.x, step.y, step.z]} castShadow receiveShadow>
          <boxGeometry args={[stepDepth, stepRise, width]} />
          <meshStandardMaterial color={index % 2 === 0 ? '#dedbd2' : '#cfcac0'} roughness={0.82} />
        </mesh>
      ))}

      {Array.from({ length: params.platformCount }, (_, index) => (
        <mesh
          key={`platform-${index}`}
          position={[
            (index + 1) * ((stepCount * stepDepth) / (params.platformCount + 1)) - stepDepth,
            (index + 1) * ((stepCount * stepRise) / (params.platformCount + 1)),
            0,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[stepDepth * 2.2, stepRise, width]} />
          <meshStandardMaterial color="#bbb6aa" roughness={0.86} />
        </mesh>
      ))}

      {params.showDimensions && (
        <Text
          position={[stepCount * stepDepth * 0.08, stepCount * stepRise + 0.35, -width * 0.65]}
          fontSize={0.28}
          color="#1e293b"
          anchorX="center"
        >
          {`${params.width}W x ${params.totalLength}L x ${params.totalHeight}H mm`}
        </Text>
      )}
    </group>
  )
}

export function StairScene() {
  return (
    <Canvas shadows camera={{ position: [5.8, 3.2, 5.8], fov: 42 }}>
      <color attach="background" args={['#eef3f7']} />
      <gridHelper args={[18, 36, '#cbd5df', '#dce4eb']} position={[0, -0.84, 0]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 4]} intensity={2.2} castShadow />
      <Bounds fit clip observe margin={1.4}>
        <StairModel />
      </Bounds>
      <ContactShadows opacity={0.28} blur={2.6} position={[0, -0.82, 0]} />
      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={14} />
    </Canvas>
  )
}
