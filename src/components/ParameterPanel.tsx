import { Eye, EyeOff } from 'lucide-react'
import { PARAMETER_LIMITS } from '../configurator/constants'
import { useStairStore } from '../configurator/store'
import type { StairParameters, ToeStyle } from '../configurator/types'

type ParameterKey = keyof Pick<
  StairParameters,
  'width' | 'totalLength' | 'totalHeight' | 'stepHeight' | 'platformCount'
>

type ParameterPanelProps = {
  issues: string[]
}

const controls: Array<{ key: ParameterKey; label: string; suffix: string }> = [
  { key: 'width', label: 'Width', suffix: 'mm' },
  { key: 'totalLength', label: 'Length', suffix: 'mm' },
  { key: 'totalHeight', label: 'Height', suffix: 'mm' },
  { key: 'stepHeight', label: 'Step height', suffix: 'mm' },
  { key: 'platformCount', label: 'Platforms', suffix: '' },
]

export function ParameterPanel({ issues }: ParameterPanelProps) {
  const params = useStairStore((state) => state.params)
  const setParam = useStairStore((state) => state.setParam)

  return (
    <section className="parameter-panel">
      <div>
        <h2>Parameters</h2>
        <p>Adjust the stair dimensions and review the live 3D preview.</p>
      </div>

      <div className="control-list">
        {controls.map((control) => {
          const limits = PARAMETER_LIMITS[control.key]
          const value = params[control.key]

          return (
            <label className="range-control" key={control.key}>
              <span>
                {control.label}
                <strong>
                  {value}
                  {control.suffix}
                </strong>
              </span>
              <input
                type="range"
                min={limits.min}
                max={limits.max}
                step={limits.step}
                value={value}
                onChange={(event) => setParam(control.key, Number(event.target.value))}
              />
              <input
                type="number"
                min={limits.min}
                max={limits.max}
                step={limits.step}
                value={value}
                onChange={(event) => setParam(control.key, Number(event.target.value))}
              />
            </label>
          )
        })}
      </div>

      <label className="select-control">
        Toe style
        <select value={params.toeStyle} onChange={(event) => setParam('toeStyle', event.target.value as ToeStyle)}>
          <option value="none">No toe extension</option>
          <option value="vertical">Vertical extension</option>
          <option value="horizontal">Horizontal extension</option>
        </select>
      </label>

      <button
        type="button"
        className="toggle-control"
        onClick={() => setParam('showDimensions', !params.showDimensions)}
      >
        {params.showDimensions ? <Eye size={16} /> : <EyeOff size={16} />}
        Dimensions {params.showDimensions ? 'on' : 'off'}
      </button>

      {issues.length > 0 && (
        <div className="validation-box" role="status">
          {issues.map((issue) => (
            <p key={issue}>{issue}</p>
          ))}
        </div>
      )}
    </section>
  )
}
