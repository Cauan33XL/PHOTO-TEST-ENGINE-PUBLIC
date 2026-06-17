import React from 'react'
import ReactDOM from 'react-dom/client'
import VisualizadorArquivos from './VisualizadorArquivosUI'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <VisualizadorArquivos />
  </React.StrictMode>,
)
