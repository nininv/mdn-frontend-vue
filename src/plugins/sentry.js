import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

Sentry.init({
  Vue,
  dsn: 'https://6d16e0d1f9784b558f91c327fe3b4604@o101010.ingest.sentry.io/5835137',
  autoSessionTracking: true,
  integrations: [
    new Integrations.BrowserTracing()
  ],

  tracesSampleRate: 1.0,
  logErrors: true
})
