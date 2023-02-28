import { NativeModule, NativeModules } from 'react-native'

interface OverlayOptions {
  passThroughTouches?: boolean
}

interface OverlayInterface extends NativeModule {
  show(moduleName: string, key: number, options?: OverlayOptions): void
  hide(key: number): void
}

const HBDOverlay: OverlayInterface = NativeModules.HBDOverlay

let keyGenerator = 1

function show(moduleName: string, options: OverlayOptions = {}) {
  const key = keyGenerator++
  HBDOverlay.show(moduleName, key, options)
  return key
}

function hide(key: number) {
  HBDOverlay.hide(key)
}

const Overlay = { show, hide }

export default Overlay
