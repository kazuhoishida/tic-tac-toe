import { useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { type SquareType, SquareAtom, MoveCountAtom, PlayerAtom } from "./stores/Atom"
import { useAtomValue, useAtom } from "jotai"
import { HeaderScene } from "./components/HeaderScene"
import { Board } from "./components/Board"
import { easing } from "maath"

export default function App() {
  const [states, setStates] = useAtom(SquareAtom)
  const [moves, setMoves] = useAtom(MoveCountAtom)
  const players = useAtomValue(PlayerAtom)
  const [winner, setWinner] = useState<string | null>(null)

  useEffect(() => {
    const result = calculateWinner({ states, moves })

    if (result) {
      setWinner(result === "draw" ? "It's a tie!! Let's do it again 👉" : result === "X" ? `Winner is ${players[0]}!!` : `Winner is ${players[1]}!!`)
    }
  }, [states])

  const reset = () => {
    setStates(Array(9).fill(null))
    setMoves(0)
    setWinner(null)
  }

  return (
    <section className="w-full h-screen overflow-hidden bg-[#dddddd]">
      <h1 className="-translate-x-1/2 -translate-y-1/2 text-[12vw] font-bold whitespace-nowrap text-[#fff] absolute top-1/2 left-1/2">Tic Tac Toe</h1>
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

        {/* Camera movements */}
        <CameraRig />

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

type CalculateWinnerType = {
  states: SquareType[]
  moves: number
}

function calculateWinner({ states, moves }: CalculateWinnerType) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ] as const

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

function CameraRig(): null {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [(state.pointer.x * state.viewport.width) / 3, (1 + state.pointer.y) / 2, 40], 0.2, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}
