import React, { useEffect } from 'react'
import { AppRegistry, BackHandler, StyleSheet } from 'react-native'

import NativeOverlay from 'hybrid-navigation-overlay'
import { Ball } from './Ball'

interface OverlayProps {
  __overlay_key__: number
}

function App({ __overlay_key__ }: OverlayProps) {
  useEffect(() => {
    const handlePress = () => {
      console.log(__overlay_key__)
      NativeOverlay.hide(__overlay_key__)
      return true
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', handlePress)

    return () => subscription.remove()
  }, [__overlay_key__])

  return <Ball size={80} style={styles.ball} onPress={() => console.log('点击了 ball')} />
}

const styles = StyleSheet.create({
  ball: {
    backgroundColor: 'red',
    borderRadius: 40,
  },
})

function registerIfNeeded() {
  if (AppRegistry.getAppKeys().includes('__overlay_floating__')) {
    return
  }
  AppRegistry.registerComponent('__overlay_floating__', () => App)
}

async function show() {
  registerIfNeeded()
  NativeOverlay.show('__overlay_floating__', { passThroughTouches: true })
}

function hide() {}

const Floating = { show, hide }

export default Floating
