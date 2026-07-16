import { Bounds, OrbitControls, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { useStairStore } from '../configurator/store'

function StairModel() {
  const params = useStairStore((state) => state.params)
  const stepCount = Math.max(1, Math.round(params.totalHeight / params.stepHeight))
  const stepDepth = params.totalLength / stepCount / 1000
  const stepRise = params.totalHeight / stepCount / 1000
  const width = params.width / 1000
  const totalLength = stepDepth * stepCount
  const totalRise = stepRise * stepCount
  const printBead = 0.06
  const slopeGeometry = useMemo(
    () => createSlopeBeadGeometry(totalLength, totalRise, printBead, width),
    [totalLength, totalRise, printBead, width],
  )

  const stepMembers = useMemo(
    () =>
      Array.from({ length: stepCount }, (_, index) => ({
        geometry: createStepBeadGeometry(stepDepth, stepRise, printBead, width),
        x: index * stepDepth,
        y: index * stepRise,
      })),
    [stepCount, stepDepth, stepRise, printBead, width],
  )

  return (
    <group position={[-totalLength / 2, -0.8, 0]}>
      <mesh geometry={slopeGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#c3c5c1" roughness={0.68} metalness={0} />
      </mesh>

      {stepMembers.map((member, index) => (
        <mesh key={index} geometry={member.geometry} position={[member.x, member.y, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#d5d3cb" roughness={0.66} metalness={0} />
        </mesh>
      ))}

      {params.showDimensions && (
        <Text
          position={[totalLength / 2, totalRise + 0.35, -width * 0.65]}
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

function createSlopeBeadGeometry(totalLength: number, totalRise: number, beadSize: number, width: number) {
  const diagonalLength = Math.hypot(totalLength, totalRise)
  const normalX = totalRise / diagonalLength
  const normalY = -totalLength / diagonalLength
  const shape = new THREE.Shape()

  shape.moveTo(0, 0)
  shape.lineTo(totalLength, totalRise)
  shape.lineTo(totalLength + normalX * beadSize, totalRise + normalY * beadSize)
  shape.lineTo(normalX * beadSize, normalY * beadSize)
  shape.lineTo(0, 0)

  return new THREE.ExtrudeGeometry(shape, {
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: beadSize * 0.22,
    bevelThickness: beadSize * 0.22,
    depth: width,
    steps: 1,
  })
}

function createStepBeadGeometry(stepDepth: number, stepRise: number, beadSize: number, width: number) {
  const shape = new THREE.Shape()
  const radius = Math.min(beadSize * 0.42, stepDepth * 0.08, stepRise * 0.18)

  shape.moveTo(radius, stepRise)
  shape.lineTo(stepDepth - radius, stepRise)
  shape.quadraticCurveTo(stepDepth, stepRise, stepDepth, stepRise - radius)
  shape.lineTo(stepDepth, stepRise - beadSize + radius)
  shape.quadraticCurveTo(stepDepth, stepRise - beadSize, stepDepth - radius, stepRise - beadSize)
  shape.lineTo(beadSize + radius, stepRise - beadSize)
  shape.quadraticCurveTo(beadSize, stepRise - beadSize, beadSize, stepRise - beadSize - radius)
  shape.lineTo(beadSize, radius)
  shape.quadraticCurveTo(beadSize, 0, beadSize - radius, 0)
  shape.lineTo(radius, 0)
  shape.quadraticCurveTo(0, 0, 0, radius)
  shape.lineTo(0, stepRise - radius)
  shape.quadraticCurveTo(0, stepRise, radius, stepRise)

  return new THREE.ExtrudeGeometry(shape, {
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: beadSize * 0.22,
    bevelThickness: beadSize * 0.22,
    depth: width,
    steps: 1,
  })
}

function SceneFloor() {
  return (
    <>
      <gridHelper args={[18, 36, '#cbd5df', '#dce4eb']} position={[0, -0.8, 0]} />
    </>
  )
}

export function StairScene() {
  return (
    <Canvas shadows camera={{ position: [5.8, 3.2, 5.8], fov: 42 }}>
      <color attach="background" args={['#eef3f7']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 4]} intensity={2.2} castShadow />
      <Bounds fit clip observe margin={1.4}>
        <StairModel />
      </Bounds>
      <SceneFloor />
      <OrbitControls makeDefault enablePan minDistance={3} maxDistance={14} />
    </Canvas>
  )
}
