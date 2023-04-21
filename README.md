# hybrid-navigation-overlay

本库已迁移到 [react-native-troika/overlay](https://github.com/sdcxtech/react-native-troika/blob/master/packages/overlay/README.md)

Native infrastructure for implementing floating UI for React Native.

## Installation

```sh
yarn add hybrid-navigation-overlay
```

### iOS

```sh
pod install
```

### Andriod

在你的项目更目录下添加或修改 react-native.config.js 文件，内容如下：

```js
// react-native.config.js
module.exports = {
  dependencies: {
    'hybrid-navigation-overlay': {
      platforms: {
        android: {
          packageInstance: 'new OverlayPackage(getReactNativeHost())',
        },
      },
    },
  },
}
```
