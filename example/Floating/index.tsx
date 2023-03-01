import React, { useEffect, useState } from 'react'
import { AppRegistry, BackHandler, StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import NativeOverlay from 'hybrid-navigation-overlay'
import { Ball } from './Ball'
import Menu from './Menu'
import { statusBarHeight } from 'hybrid-navigation'

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

  const { width: windowWidth } = useWindowDimensions()

  function renderAnchor() {
    return (
      <View style={styles.thumb}>
        <Text>Menu</Text>
      </View>
    )
  }

  const [menuVisible, setMenuVisible] = useState(false)

  if (menuVisible) {
    return (
      <Menu
        anchorX={16}
        anchorY={statusBarHeight()}
        anchorSize={80}
        anchorColor="red"
        renderAnchor={renderAnchor}
        onClose={() => setMenuVisible(false)}
      />
    )
  }

  return (
    <Ball size={80} style={styles.ball} onPress={() => setMenuVisible(true)}>
      {renderAnchor()}
    </Ball>
  )
}

const styles = StyleSheet.create({
  ball: {
    backgroundColor: 'red',
    borderRadius: 40,
  },
  thumb: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
