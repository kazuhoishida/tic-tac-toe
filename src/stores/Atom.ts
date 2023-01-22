import { atom } from "jotai"

type SquareType = "X" | "O" | null
export const SquareAtom = atom<SquareType[]>(Array(9).fill(null))
export const MoveCountAtom = atom<number>(0)
export const PlayerAtom = atom<string[]>(["Player01", "Player02"])
