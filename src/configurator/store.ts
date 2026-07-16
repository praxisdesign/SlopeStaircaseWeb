import { create } from 'zustand'
import { DEFAULT_PARAMETERS, PARAMETER_LIMITS } from './constants'
import type { StairParameters } from './types'

type StairStore = {
  params: StairParameters
  setParam: <Key extends keyof StairParameters>(key: Key, value: StairParameters[Key]) => void
  reset: () => void
}

function clampNumericParam<Key extends keyof typeof PARAMETER_LIMITS>(key: Key, value: number) {
  const limits = PARAMETER_LIMITS[key]
  return Math.min(limits.max, Math.max(limits.min, value))
}

export const useStairStore = create<StairStore>((set) => ({
  params: DEFAULT_PARAMETERS,
  setParam: (key, value) =>
    set((state) => {
      const nextValue =
        typeof value === 'number' && key in PARAMETER_LIMITS
          ? clampNumericParam(key as keyof typeof PARAMETER_LIMITS, value)
          : value

      return {
        params: {
          ...state.params,
          [key]: nextValue,
        },
      }
    }),
  reset: () => set({ params: DEFAULT_PARAMETERS }),
}))
