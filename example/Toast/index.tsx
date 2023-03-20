import React, { useEffect } from 'react'
import { AppRegistry, BackHandler, StyleSheet, Text, View } from 'react-native'

import Overlay from 'hybrid-navigation-overlay'
interface Props {
  message?: string
}
function App({ message = 'Toast' }: Props) {
  useEffect(() => {
    const handlePress = () => {
      Overlay.hide('Toast')
      return true
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', handlePress)

    return () => subscription.remove()
  }, [])

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.box}>
        <Text style={styles.text}>{message}</Text>
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
  AppRegistry.registerComponent('Toast', () => App)
}

async function show(message: string) {
  registerIfNeeded()
  Overlay.show<Props>('Toast', { message }, { passThroughTouches: false })
  setTimeout(() => {
    hide()
  }, 3000)
}

function hide() {
  Overlay.hide('Toast')
}

const Toast = { show, hide }

export default Toast
