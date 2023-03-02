import { NativeModule, NativeModules } from 'react-native'

interface OverlayOptions {
  passThroughTouches?: boolean
}

interface OverlayInterface extends NativeModule {
  show(moduleName: string, options?: OverlayOptions): void
  hide(moduleName: string): void
}

const HBDOverlay: OverlayInterface = NativeModules.HBDOverlay

function show(moduleName: string, options: OverlayOptions = {}) {
  HBDOverlay.show(moduleName, options)
}

function hide(moduleName: string) {
  HBDOverlay.hide(moduleName)
}

const Overlay = { show, hide }

export default Overlay
