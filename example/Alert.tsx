import React, { useEffect } from 'react'
import { AppRegistry, BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Toast from './Toast'
import NativeOverlay from 'hybrid-navigation-overlay'

const overlay = new NativeOverlay('Alert')

function Overlay() {
  useEffect(() => {
    const handlePress = () => {
      overlay.hide()
      return true
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', handlePress)

    return () => subscription.remove()
  }, [])

  function cancel() {
    overlay.hide()
  }

  function toast() {
    Toast.show()
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Alert</Text>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={toast} activeOpacity={0.2} style={styles.button}>
            <Text style={styles.buttonText}>确定</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancel} activeOpacity={0.2} style={styles.button}>
            <Text style={styles.buttonText}>取消</Text>
          </TouchableOpacity>
        </View>
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
    width: 280,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    width: 40,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
  },
})

function registerIfNeeded() {
  if (AppRegistry.getAppKeys().includes('Alert')) {
    return
  }
  AppRegistry.registerComponent('Alert', () => Overlay)
}

function show() {
  registerIfNeeded()
  overlay.show()
}

function hide() {
  overlay.hide()
}

const Alert = { show, hide }

export default Alert
