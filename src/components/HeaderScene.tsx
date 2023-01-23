import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Torus, Icosahedron } from "@react-three/drei"
import * as THREE from "three"
import { COLORS } from "../utils/const"

export function HeaderScene() {
  const torusRef1 = useRef<THREE.Object3D>()
  const torusRef2 = useRef<THREE.Object3D>()
  const icosahedronRef1 = useRef<THREE.Object3D>()
  const icosahedronRef2 = useRef<THREE.Object3D>()

  useFrame(() => {
    if (!torusRef1.current || !torusRef2.current || !icosahedronRef1.current || !icosahedronRef2.current) return

    torusRef1.current.rotation.x -= 0.01
    torusRef2.current.rotation.x += 0.01
    torusRef1.current.rotation.y += 0.01
    torusRef2.current.rotation.y -= 0.01

    icosahedronRef1.current.rotation.x += 0.01
    icosahedronRef2.current.rotation.x -= 0.01
    icosahedronRef1.current.rotation.y -= 0.01
    icosahedronRef2.current.rotation.y += 0.01
  })

  const objectMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 0.5,
    roughness: 0.2,
  })

  type TorusType = {
    args?: [radius?: number | undefined, tube?: number | undefined, radialSegments?: number | undefined, tubularSegments?: number | undefined, arc?: number | undefined]
  }
  type IcosahedronType = {
    args?: [radius?: number | undefined, detail?: number | undefined] | undefined
    children?: React.ReactNode
  }

  const torusProps = { args: [3.5, 1.1, 16, 100] } as TorusType

  const icosahedronProps = {
    args: [4.6, 0],
  } as IcosahedronType

  return (
    <group position={[0, 17, 0]}>
      <Torus {...torusProps} position={[-15, 0, 0]} ref={torusRef1}>
        <meshStandardMaterial {...objectMaterial} color={COLORS[0]} />
      </Torus>
      <Icosahedron {...icosahedronProps} position={[-5, 0, 0]} ref={icosahedronRef1}>
        <meshStandardMaterial {...objectMaterial} color={COLORS[1]} />
      </Icosahedron>
      <Torus {...torusProps} position={[5, 0, 0]} ref={torusRef2}>
        <meshStandardMaterial {...objectMaterial} color={COLORS[0]} />
      </Torus>
      <Icosahedron {...icosahedronProps} position={[15, 0, 0]} ref={icosahedronRef2}>
        <meshStandardMaterial {...objectMaterial} color={COLORS[1]} />
      </Icosahedron>
    </group>
  )
}
