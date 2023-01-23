import { Torus, Icosahedron, RoundedBox } from "@react-three/drei"
import { SquareAtom, MoveCountAtom } from "../stores/Atom"
import { useAtom } from "jotai"
import * as THREE from "three"
import { COLORS } from "../utils/const"

export function Board() {
  const [states, setStates] = useAtom(SquareAtom)
  const [moves, setMoves] = useAtom(MoveCountAtom)

  const updateState = (i: number) => {
    const newStates = [...states]

    newStates[i] = moves % 2 === 0 ? "X" : "O"
    setStates(newStates)
    setMoves(moves + 1)
  }

  // calc position
  const calcPosition = (i: number) => {
    const GAP_SIZE = 7
    const x = (i % 3) * GAP_SIZE
    const y = Math.floor(i / 3) * GAP_SIZE
    return { position: [x, y, 0] as [number, number, number] }
  }

  const objectMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 0.5,
    roughness: 0.2,
  })

  return (
    <group position={[0, -14, 0]} rotation-z={Math.PI / 4}>
      {[...Array(9)].map((_, i) =>
        states[i] === null ? (
          <RoundedBox key={i} args={[6, 6, 6]} radius={0.8} {...calcPosition(i)} onPointerDown={() => updateState(i)} castShadow receiveShadow>
            <meshStandardMaterial {...objectMaterial} color={COLORS[3]} />
          </RoundedBox>
        ) : states[i] === "X" ? (
          <Torus key={i} args={[2.2, 0.8, 16, 100]} {...calcPosition(i)} castShadow receiveShadow>
            <meshStandardMaterial {...objectMaterial} color={COLORS[0]} />
          </Torus>
        ) : (
          <Icosahedron rotation-x={Math.PI / 2} key={i} args={[3.2, 0]} {...calcPosition(i)} castShadow receiveShadow>
            <meshStandardMaterial {...objectMaterial} color={COLORS[1]} />
          </Icosahedron>
        )
      )}
    </group>
  )
}
