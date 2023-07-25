import type { ContextBridgeApi } from '../electron/preload'

declare global {
  interface Window {
    api: ContextBridgeApi
  }
}