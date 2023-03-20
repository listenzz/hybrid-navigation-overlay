import React from 'react'
import { withNavigationItem } from 'hybrid-navigation'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import Toast from './Toast'
import Alert from './Alert'
import Floating from './Floating'

function App() {
  function handlePress() {}

  function toast() {
    Toast.show(`Toast at ${new Date().toLocaleTimeString()}`)
  }

  function alert() {
    Alert.show()
  }

  function floating() {
    Floating.show()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hello World!</Text>
      <TouchableOpacity onPress={toast} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>Toast</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={alert} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>Alert</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={floating} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>Floating-Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>Popover</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>Illustrator</Text>
      </TouchableOpacity>
    </View>
  )
}

export default withNavigationItem({
  titleItem: {
    title: 'Overlay 演示',
  },
})(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },

  buttonText: {
    backgroundColor: 'transparent',
    color: 'rgb(34,88,220)',
  },

  welcome: {
    backgroundColor: 'transparent',
    fontSize: 17,
    textAlign: 'center',
    margin: 8,
  },
})
