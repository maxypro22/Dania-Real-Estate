import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { bootstrapCms } from './cms/boot'
import App from './App.tsx'

// Load saved CMS content and apply it before React renders (no flash of defaults).
bootstrapCms()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
