import React from 'react'
import { withNavigationItem } from 'hybrid-navigation'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import Toast from './Toast'
import Alert from './Alert'

function App() {
  function handlePress() {}

  function toast() {
    Toast.show()
  }

  function alert() {
    Alert.show()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hello World!</Text>
      <TouchableOpacity onPress={toast} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>toast</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={alert} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>alert</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>notification</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.2} style={styles.button}>
        <Text style={styles.buttonText}>all</Text>
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
