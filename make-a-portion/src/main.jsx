import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import Clarity from '@microsoft/clarity'
import { Analytics } from '@vercel/analytics/react'
import './styles/globals.css'
import App from './App.jsx'

// Production-only observability: don't pollute dashboards from local dev.
if (import.meta.env.PROD) {
  // Sentry — catch unhandled errors and promise rejections (init before render).
  Sentry.init({
    dsn: 'https://066f44f007ba1055364c74801478352d@o4511616321847296.ingest.de.sentry.io/4511616334299216',
    sampleRate: 1.0, // capture every error
  })

  // Microsoft Clarity — session recordings + heatmaps.
  Clarity.init('xbo7hqkldy')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <p style={{ padding: 24, textAlign: 'center', direction: 'rtl' }}>
          משהו השתבש. נסו לרענן את הדף.
        </p>
      }
    >
      <App />
      <Analytics />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
