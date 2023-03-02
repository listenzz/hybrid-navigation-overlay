import { statusBarHeight } from 'hybrid-navigation'
import React, { PropsWithChildren } from 'react'
import { Platform, StyleSheet, useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import DropShadow from 'react-native-drop-shadow'
import { BallProps } from './types'

const AnimatedDropShadow = Animated.createAnimatedComponent(DropShadow)

export function Ball({ anchor, children, onPress, onPositionChange = () => {} }: PropsWithChildren<BallProps>) {
  const barHeight = Platform.OS === 'android' ? statusBarHeight() : 0
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const gap = 8

  const transf = useSharedValue({ x: 0, y: 0 })
  const x = useSharedValue(anchor.x)
  const y = useSharedValue(anchor.y)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: transf.value.x }, { translateY: transf.value.y }],
      width: anchor.size,
      height: anchor.size,
      borderRadius: anchor.size / 2,
      overflow: 'hidden',
    }
  })

  const floatStyles = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: x.value,
      top: y.value,
    }
  })

  const offsetY = barHeight

  const singleTap = Gesture.Tap().onEnd(runOnJS(() => onPress?.()))

  const dragGesture = Gesture.Pan()
    .onChange(e => {
      transf.value = { x: e.changeX + transf.value.x, y: e.changeY + transf.value.y }
    })
    .onFinalize(e => {
      transf.value = { x: 0, y: 0 }
      x.value = e.absoluteX - e.x
      const finalX = x.value > (windowWidth - anchor.size) / 2 ? windowWidth - anchor.size - gap : gap
      x.value = withSpring(finalX, {
        stiffness: 500,
        overshootClamping: true,
      })
      y.value = e.absoluteY + offsetY - e.y
      const finalY = Math.min(Math.max(barHeight, y.value), windowHeight - anchor.size)
      y.value = withSpring(finalY, {
        stiffness: 500,
        overshootClamping: true,
      })

      runOnJS(onPositionChange)(finalX, finalY)
    })

  return (
    <AnimatedDropShadow style={[styles.shadow, floatStyles]}>
      <GestureHandlerRootView>
        <GestureDetector gesture={Gesture.Simultaneous(dragGesture, singleTap)}>
          <Animated.View style={[animatedStyles]}>{children}</Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </AnimatedDropShadow>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowRadius: 8,
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
})
