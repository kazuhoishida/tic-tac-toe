import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Torus, Icosahedron, RoundedBox, Html } from "@react-three/drei"
import { SquareAtom, MoveCountAtom, PlayerAtom } from "./stores/Atom"
import { useAtomValue, useSetAtom } from "jotai"
import * as THREE from "three"

const COLORS = ["#cd0c33", "#0e70ac", "#fff"]

function Board() {
  const states = useAtomValue(SquareAtom)
  const setState = useSetAtom(SquareAtom)

  const moves = useAtomValue(MoveCountAtom)
  const setMoves = useSetAtom(MoveCountAtom)

  // update i th state
  const updateState = (i: number) => {
    const newStates = [...states]

    if (moves % 2 === 0) {
      newStates[i] = "X"
    } else {
      newStates[i] = "O"
    }
    setState(newStates)
    setMoves(moves + 1)
  }

  // calc position
  const calcPosition = (i: number) => {
    const x = (i % 3) * 7
    const y = Math.floor(i / 3) * 7
    return { position: [x, y, 0] as [number, number, number] }
  }

  const objectMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 0.5,
    roughness: 0.2,
  })

  return (
    <group position={[0, -14, 0]} rotation-z={Math.PI / 4}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((field, i) =>
        states[i] === null ? (
          <RoundedBox key={field} args={[6, 6, 6]} radius={0.8} {...calcPosition(i)} onPointerDown={() => updateState(i)} castShadow receiveShadow>
            <meshStandardMaterial {...objectMaterial} color={COLORS[3]} />
          </RoundedBox>
        ) : states[i] === "X" ? (
          <Torus key={field} args={[2.2, 0.8, 16, 100]} {...calcPosition(i)} castShadow receiveShadow>
            <meshStandardMaterial {...objectMaterial} color={COLORS[0]} />
          </Torus>
        ) : (
          <Icosahedron rotation-x={Math.PI / 2} key={field} args={[3.2, 0]} {...calcPosition(i)} castShadow receiveShadow>
            <meshStandardMaterial {...objectMaterial} color={COLORS[1]} />
          </Icosahedron>
        )
      )}
    </group>
  )
}

function HeaderScene() {
  const torusRef1 = useRef<any>()
  const torusRef2 = useRef<any>()
  const icosahedronRef1 = useRef<any>()
  const icosahedronRef2 = useRef<any>()

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

  const torusProps = {
    args: [3.5, 1.1, 16, 100],
  }
  const icosahedronProps = {
    args: [4.6, 0],
  }

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

export default function App() {
  const states = useAtomValue(SquareAtom)
  const setState = useSetAtom(SquareAtom)

  const moves = useAtomValue(MoveCountAtom)
  const setMoves = useSetAtom(MoveCountAtom)

  useEffect(() => {
    console.log(states)
  }, [states])

  function calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (states[a] && states[a] === states[b] && states[a] === states[c]) {
        return states[a]
      } else if (moves === 9) {
        return "draw"
      }
    }
    return null
  }

  const players = useAtomValue(PlayerAtom)
  // const setPlayers = useSetAtom(PlayerAtom)
  const [winner, setWinner] = useState<string | null>(null)
  useEffect(() => {
    const result = calculateWinner()

    if (result) {
      setWinner(result === "draw" ? "It's a tie!! Let's do it again 👉" : result === "X" ? `Winner is ${players[0]}!!` : `Winner is ${players[1]}!!`)
    }
  }, [states])

  const reset = () => {
    setState(Array(9).fill(null))
    setMoves(0)
    setWinner(null)
  }

  return (
    <section className="w-full h-screen overflow-hidden bg-[#e6e6e6]">
      <h1 className="-translate-x-1/2 -translate-y-1/2 text-[12vw] font-bold whitespace-nowrap text-[#fff] absolute top-1/2 left-1/2">Tic Toc Toe</h1>
      <Canvas
        camera={{
          fov: 60,
          near: 1,
          far: 1000,
          position: [0, 0, 40],
        }}
        shadows
        className={`w-full h-full z-0 ${winner === null ? "" : "pointer-events-none"}`}
      >
        <ambientLight intensity={1} castShadow />
        <pointLight position={[-28, 28, 26]} intensity={1.6} castShadow shadow-mapSize-height={1024} shadow-mapSize-width={1024} shadow-radius={6} />

        <HeaderScene />
        <Board />

        {/* <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} /> */}
      </Canvas>
      <div className="text-16 font-bold">
        <p className="fixed bottom-6 text-center w-full">{winner}</p>
        <button className="px-4 text-red-700 fixed bottom-6 right-20" onClick={reset}>
          Reset
        </button>
      </div>
    </section>
  )
}
