import { NativeModules } from 'react-native'

const { HBDOverlay } = NativeModules

let keyGenerator = 1

function show(moduleName: string) {
  const key = keyGenerator++
  HBDOverlay.showOverlay(moduleName, key)
  return key
}

function hide(key: number) {
  HBDOverlay.hideOverlay(key)
}

const Overlay = { show, hide }

export default Overlay
