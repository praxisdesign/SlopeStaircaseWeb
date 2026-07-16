import { Download, FileText, Mail, RotateCcw, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'
import { ParameterPanel } from './components/ParameterPanel'
import { StairScene } from './components/StairScene'
import { useStairStore } from './configurator/store'
import { getValidationIssues } from './configurator/validation'

function App() {
  const [activePanel, setActivePanel] = useState<'design' | 'export'>('design')
  const params = useStairStore((state) => state.params)
  const reset = useStairStore((state) => state.reset)
  const issues = useMemo(() => getValidationIssues(params), [params])

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">3D slope stair configurator</p>
          <h1>SlopeStaircaseWeb</h1>
        </div>
        <button type="button" className="icon-button" onClick={reset} title="Reset design">
          <RotateCcw size={18} />
        </button>
      </header>

      <section className="workspace" aria-label="Slope stair configurator">
        <div className="viewer-panel">
          <StairScene />
        </div>

        <aside className="control-panel" aria-label="Configurator controls">
          <nav className="panel-tabs" aria-label="Configuration steps">
            <button
              type="button"
              className={activePanel === 'design' ? 'active' : ''}
              onClick={() => setActivePanel('design')}
            >
              <FileText size={16} />
              Design
            </button>
            <button
              type="button"
              className={activePanel === 'export' ? 'active' : ''}
              onClick={() => setActivePanel('export')}
            >
              <Send size={16} />
              Export
            </button>
          </nav>

          {activePanel === 'design' ? (
            <ParameterPanel issues={issues} />
          ) : (
            <section className="export-panel">
              <div>
                <h2>Export request</h2>
                <p>Use these placeholders for the first PDF and quote workflow.</p>
              </div>
              <label>
                Your name
                <input type="text" placeholder="Type your name" />
              </label>
              <label>
                Company
                <input type="text" placeholder="Company name" />
              </label>
              <label>
                Email
                <input type="email" placeholder="name@example.com" />
              </label>
              <div className="export-actions">
                <button type="button">
                  <Download size={16} />
                  PDF placeholder
                </button>
                <button type="button">
                  <Mail size={16} />
                  Quote placeholder
                </button>
              </div>
            </section>
          )}
        </aside>
      </section>
    </main>
  )
}

export default App
