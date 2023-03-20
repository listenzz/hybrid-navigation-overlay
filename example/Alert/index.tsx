import React, { useEffect } from 'react'
import { AppRegistry, BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Toast from '../Toast'
import Overlay from 'hybrid-navigation-overlay'
interface Props {
  title: string
}
function App({ title = 'Alert' }: Props) {
  useEffect(() => {
    const handlePress = () => {
      Overlay.hide('Alert')
      return true
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', handlePress)

    return () => subscription.remove()
  }, [])

  function cancel() {
    Overlay.hide('Alert')
  }

  function toast() {
    Toast.show('确定')
    Overlay.hide('Alert')
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>{title}</Text>
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
    backgroundColor: '#00000099',
  },
  box: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    width: 280,
  },
  text: {
    fontSize: 16,
    color: '#222',
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
    color: '#222',
  },
})

function registerIfNeeded() {
  if (AppRegistry.getAppKeys().includes('Alert')) {
    return
  }
  AppRegistry.registerComponent('Alert', () => App)
}

function show(title?: string) {
  registerIfNeeded()
  Overlay.show('Alert', { title })
}

function hide() {}

const Alert = { show, hide }

export default Alert
