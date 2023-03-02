import React, { useEffect, useRef, useState } from 'react'
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
  const [menuVisible, setMenuVisible] = useState(false)

  const left = useRef(16)
  const top = useRef(statusBarHeight())

  const anchor = {
    x: left.current,
    y: top.current,
    size: 64,
  }

  function renderAnchor() {
    return (
      <View style={styles.ball}>
        <Text>Menu</Text>
      </View>
    )
  }

  if (menuVisible) {
    return <Menu anchor={anchor} renderAnchor={renderAnchor} onClose={() => setMenuVisible(false)} />
  }

  return (
    <Ball
      anchor={anchor}
      onPress={() => setMenuVisible(true)}
      onPositionChange={(x, y) => {
        left.current = x
        top.current = y
      }}>
      {renderAnchor()}
    </Ball>
  )
}

const styles = StyleSheet.create({
  ball: {
    flex: 1,
    backgroundColor: 'red',
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
