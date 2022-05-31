import React, { useEffect } from 'react'
import { AppRegistry, BackHandler, StyleSheet, Text, View } from 'react-native'

import NativeOverlay from 'hybrid-navigation-overlay'

const overlay = new NativeOverlay('Toast')

function Overlay() {
  useEffect(() => {
    const handlePress = () => {
      overlay.hide()
      return true
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', handlePress)

    return () => subscription.remove()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Toast</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#00000099',
    padding: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
})

function registerIfNeeded() {
  if (AppRegistry.getAppKeys().includes('Toast')) {
    return
  }
  AppRegistry.registerComponent('Toast', () => Overlay)
}

async function show() {
  registerIfNeeded()
  overlay.show()
}

function hide() {
  overlay.hide()
}

const Toast = { show, hide }

export default Toast
