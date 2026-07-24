import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_PARAMETERS, PARAMETER_LIMITS } from './constants'
import type { CameraSnapshot, StairParameters } from './types'

type StairStore = {
  params: StairParameters
  camera: CameraSnapshot | null
  setParam: <Key extends keyof StairParameters>(key: Key, value: StairParameters[Key]) => void
  setCamera: (camera: CameraSnapshot | null) => void
  reset: () => void
}

function clampNumericParam<Key extends keyof typeof PARAMETER_LIMITS>(key: Key, value: number) {
  const limits = PARAMETER_LIMITS[key]
  return Math.min(limits.max, Math.max(limits.min, value))
}

// Portal embeds this tool once per project (see ToolWorkspace.tsx), passing the
// project id as `?project=`. Scoping the persisted storage key by it keeps two
// projects using this tool from overwriting each other's saved parameters.
function storageKey(base: string) {
  if (typeof window === 'undefined') return base
  const projectId = new URLSearchParams(window.location.search).get('project')
  return projectId ? `${base}:${projectId}` : base
}

export const useStairStore = create<StairStore>()(
  persist(
    (set) => ({
      params: DEFAULT_PARAMETERS,
      camera: null,
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
      setCamera: (camera) => set({ camera }),
      reset: () => set({ params: DEFAULT_PARAMETERS }),
    }),
    { name: storageKey('slope-staircase') },
  ),
)
