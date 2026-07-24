import { Layers } from 'lucide-react'
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

const controls: Array<{ key: ParameterKey; label: string; suffix: string; note?: string }> = [
  { key: 'width', label: 'Stair Width', suffix: ' mm' },
  { key: 'totalLength', label: 'Run Length', suffix: ' mm' },
  { key: 'totalHeight', label: 'Rise Height', suffix: ' mm' },
  { key: 'stepHeight', label: 'Step Height', suffix: ' mm' },
  {
    key: 'platformCount',
    label: 'Platform Count',
    suffix: '',
    note: 'Not yet reflected in the 3D model — only used for the validation warning below.',
  },
]

export function ParameterPanel({ issues }: ParameterPanelProps) {
  const params = useStairStore((state) => state.params)
  const setParam = useStairStore((state) => state.setParam)

  return (
    <section className="parameter-panel">
      <div className="settings-card">
        <div className="card-title">
          <Layers size={19} />
          <h2>Size</h2>
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
                {control.note && <small className="control-note">{control.note}</small>}
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
      </div>

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
