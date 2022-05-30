import { NativeModules } from 'react-native'

const { HBDOverlay } = NativeModules

export default HBDOverlay

export function lib(a: number, b: number) {
  return a + b + 2
}
