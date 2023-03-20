import { NativeModule, NativeModules } from 'react-native'

interface OverlayOptions {
  passThroughTouches?: boolean
}

interface PropsType {
  [index: string]: any
}
interface OverlayInterface extends NativeModule {
  show<P extends PropsType = {}>(moduleName: string, props?: P, options?: OverlayOptions): void
  hide(moduleName: string): void
}

const HBDOverlay: OverlayInterface = NativeModules.HBDOverlay

function show<P extends PropsType = {}>(moduleName: string, props?: P, options: OverlayOptions = {}) {
  HBDOverlay.show(moduleName, props, options)
}

function hide(moduleName: string) {
  HBDOverlay.hide(moduleName)
}

const Overlay = { show, hide }

export default Overlay
