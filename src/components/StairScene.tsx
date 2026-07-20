import { Bounds, GizmoHelper, GizmoViewport, OrbitControls, Text } from '@react-three/drei'
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
  const slopeAngleDegrees = THREE.MathUtils.radToDeg(Math.atan2(totalRise, totalLength))
  const printBead = 0.06
  const slopeGeometry = useMemo(
    () => createSlopeBeadGeometry(totalLength, totalRise, printBead, width),
    [totalLength, totalRise, printBead, width],
  )
  const toeGeometry = useMemo(
    () => createToeGeometry(params.toeStyle, stepDepth, stepRise, printBead, width),
    [params.toeStyle, stepDepth, stepRise, printBead, width],
  )
  const beadRadius = printBead * 0.18
  const concreteColor = '#9a9a94'

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
    <group position={[-totalLength / 2, 0, -0.8]}>
      <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh geometry={slopeGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={concreteColor} roughness={0.7} metalness={0} />
      </mesh>
      {toeGeometry && (
        <mesh geometry={toeGeometry} castShadow receiveShadow>
          <meshStandardMaterial color={concreteColor} roughness={0.7} metalness={0} />
        </mesh>
      )}
      <PrintedSurfacePattern
        beadRadius={beadRadius}
        printBead={printBead}
        stepCount={stepCount}
        stepDepth={stepDepth}
        stepRise={stepRise}
        toeStyle={params.toeStyle}
        totalLength={totalLength}
        totalRise={totalRise}
        width={width}
      />

      {stepMembers.map((member, index) => (
        <mesh key={index} geometry={member.geometry} position={[member.x, member.y, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={concreteColor} roughness={0.7} metalness={0} />
        </mesh>
      ))}

      {params.showDimensions && (
        <>
          <Text
            position={[totalLength / 2, totalRise + 0.35, -width * 0.65]}
            fontSize={0.28}
            color="#1e293b"
            anchorX="center"
          >
            {`${params.width}W x ${params.totalLength}L x ${params.totalHeight}H mm · ${slopeAngleDegrees.toFixed(1)}°`}
          </Text>
          <AngleDimension totalLength={totalLength} totalRise={totalRise} width={width} />
        </>
      )}
      </group>
    </group>
  )
}

type AngleDimensionProps = {
  totalLength: number
  totalRise: number
  width: number
}

function AngleDimension({ totalLength, totalRise, width }: AngleDimensionProps) {
  const angle = Math.atan2(totalRise, totalLength)
  const radius = Math.min(Math.max(Math.min(totalLength, totalRise) * 0.32, 0.35), 0.85)
  const dimensionZ = -Math.max(width * 0.12, 0.09)
  const dimensionLine = useMemo(() => {
    const points = [new THREE.Vector3(0, 0, dimensionZ), new THREE.Vector3(radius * 1.25, 0, dimensionZ)]
    const arcSegments = 28

    for (let index = 0; index <= arcSegments; index += 1) {
      const arcAngle = (angle * index) / arcSegments
      points.push(new THREE.Vector3(Math.cos(arcAngle) * radius, Math.sin(arcAngle) * radius, dimensionZ))
    }

    points.push(
      new THREE.Vector3(0, 0, dimensionZ),
      new THREE.Vector3(Math.cos(angle) * radius * 1.25, Math.sin(angle) * radius * 1.25, dimensionZ),
    )

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: '#2563eb' })

    return new THREE.Line(geometry, material)
  }, [angle, dimensionZ, radius])
  return (
    <group>
      <primitive object={dimensionLine} />
    </group>
  )
}

type PrintedSurfacePatternProps = {
  beadRadius: number
  printBead: number
  stepCount: number
  stepDepth: number
  stepRise: number
  toeStyle: 'none' | 'vertical' | 'horizontal'
  totalLength: number
  totalRise: number
  width: number
}

function PrintedSurfacePattern({
  beadRadius,
  printBead,
  stepCount,
  stepDepth,
  stepRise,
  toeStyle,
  totalLength,
  totalRise,
  width,
}: PrintedSurfacePatternProps) {
  const slopeLength = Math.hypot(totalLength, totalRise)
  const slopeAngle = Math.atan2(totalRise, totalLength)
  const frontZ = width + beadRadius * 0.65
  const beadSpacing = 0.02
  const topPatternCount = Math.floor(width / beadSpacing) + 1
  const riserPatternCount = Math.floor(stepRise / beadSpacing) + 1
  const treadSidePatternCount = Math.max(1, Math.floor(0.06 / beadSpacing) - 1)
  const material = <meshStandardMaterial color="#9a9a94" roughness={0.7} metalness={0} />

  return (
    <group>
      {toeStyle === 'horizontal' && (
        <mesh
          position={[
            -stepDepth * 0.3,
            -Math.tan(slopeAngle) * stepDepth * 0.3 + beadRadius * 0.15,
            frontZ,
          ]}
          rotation={[0, 0, slopeAngle - Math.PI / 2]}
        >
          <cylinderGeometry args={[beadRadius, beadRadius, stepDepth * 0.6, 18]} />
          {material}
        </mesh>
      )}
      {toeStyle === 'vertical' && (
        <mesh position={[beadRadius * 0.15, -stepRise * 0.3, frontZ]}>
          <cylinderGeometry args={[beadRadius, beadRadius, stepRise * 0.6, 18]} />
          {material}
        </mesh>
      )}
      <mesh position={[totalLength / 2, totalRise / 2, frontZ]} rotation={[0, 0, slopeAngle - Math.PI / 2]}>
        <cylinderGeometry args={[beadRadius, beadRadius, slopeLength, 18]} />
        {material}
      </mesh>

      {Array.from({ length: stepCount }, (_, index) => (
        <group key={index}>
          <mesh
            position={[index * stepDepth + stepDepth / 2, (index + 1) * stepRise + beadRadius * 0.15, frontZ]}
            rotation={[0, 0, -Math.PI / 2]}
          >
            <cylinderGeometry args={[beadRadius, beadRadius, stepDepth, 18]} />
            {material}
          </mesh>
          <mesh position={[index * stepDepth + beadRadius * 0.15, index * stepRise + stepRise / 2, frontZ]}>
            <cylinderGeometry args={[beadRadius, beadRadius, stepRise, 18]} />
            {material}
          </mesh>
          {Array.from({ length: riserPatternCount }, (_, beadIndex) => {
            const y = index * stepRise + Math.min(beadIndex * beadSpacing, stepRise)

            return (
              <mesh
                key={`riser-${beadIndex}`}
                position={[index * stepDepth + beadRadius * 0.85, y, width / 2]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[beadRadius, beadRadius, width, 18]} />
                {material}
              </mesh>
            )
          })}
          {Array.from({ length: treadSidePatternCount }, (_, beadIndex) => {
            const y = (index + 1) * stepRise - printBead + (beadIndex + 1) * beadSpacing

            return (
              <group key={`tread-side-${beadIndex}`}>
                {[-beadRadius * 0.65, width + beadRadius * 0.65].map((z) => {
                  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(index * stepDepth + beadRadius * 1.5, y, z),
                    new THREE.Vector3((index + 1) * stepDepth - beadRadius * 1.5, y, z),
                  ])

                  return (
                    <lineSegments key={z} geometry={lineGeometry}>
                      <lineBasicMaterial color="#9a9a94" />
                    </lineSegments>
                  )
                })}
              </group>
            )
          })}
          {Array.from({ length: topPatternCount }, (_, beadIndex) => {
            const z = Math.min(beadIndex * beadSpacing, width) + beadRadius * 0.8

            return (
              <mesh
                key={beadIndex}
                position={[
                  index * stepDepth + stepDepth / 2,
                  (index + 1) * stepRise + beadRadius * 0.85,
                  z,
                ]}
                rotation={[0, 0, -Math.PI / 2]}
              >
                <cylinderGeometry args={[beadRadius, beadRadius, stepDepth, 18]} />
                {material}
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

function createToeGeometry(
  toeStyle: 'none' | 'vertical' | 'horizontal',
  stepDepth: number,
  stepRise: number,
  beadSize: number,
  width: number,
) {
  if (toeStyle === 'none') {
    return null
  }

  const shape = new THREE.Shape()

  if (toeStyle === 'horizontal') {
    const extension = stepDepth * 0.6
    const slopeAngle = Math.atan2(stepRise, stepDepth)
    const riseAtExtension = Math.tan(slopeAngle) * extension
    shape.moveTo(-extension, 0)
    shape.lineTo(0, 0)
    shape.lineTo(0, beadSize)
    shape.lineTo(-extension, beadSize - riseAtExtension)
    shape.lineTo(-extension, 0)
  }

  if (toeStyle === 'vertical') {
    const extension = stepRise * 0.6
    shape.moveTo(0, -extension)
    shape.lineTo(beadSize, -extension)
    shape.lineTo(beadSize, 0)
    shape.lineTo(0, 0)
    shape.lineTo(0, -extension)
  }

  return new THREE.ExtrudeGeometry(shape, {
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: beadSize * 0.22,
    bevelThickness: beadSize * 0.22,
    depth: width,
    steps: 1,
  })
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
      <gridHelper args={[18, 36, '#cbd5df', '#dce4eb']} position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]} />
    </>
  )
}

export function StairScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [5.8, -5.8, 3.2], fov: 42, up: [0, 0, 1] }}
      onCreated={({ camera }) => {
        camera.up.set(0, 0, 1)
      }}
    >
      <color attach="background" args={['#eef3f7']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, -4, 6]} intensity={2.2} castShadow />
      <Bounds fit clip observe margin={1.4}>
        <StairModel />
      </Bounds>
      <SceneFloor />
      <OrbitControls makeDefault enablePan minDistance={3} maxDistance={14} />
      <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
        <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="#0f172a" />
      </GizmoHelper>
    </Canvas>
  )
}
