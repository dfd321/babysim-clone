/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_WEBSOCKET_URL?: string
  readonly VITE_USE_MOCK_API?: string
  readonly VITE_MOCK_DELAY_MS?: string
  readonly VITE_ENABLE_WEBSOCKET?: string
  readonly VITE_ENABLE_PHOTO_GENERATION?: string
  readonly DEV?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
