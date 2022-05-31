import { NativeModules } from 'react-native'

const { HBDOverlay } = NativeModules

export default class NativeOverlay {
  private _key = -1

  constructor(public moduleName: string) {}

  show() {
    HBDOverlay.showOverlay(this.moduleName).then((key: number) => (this._key = key))
  }

  hide() {
    HBDOverlay.hideOverlay(this._key)
  }
}
