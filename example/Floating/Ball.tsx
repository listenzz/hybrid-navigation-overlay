import { statusBarHeight } from 'hybrid-navigation'
import React, { PropsWithChildren } from 'react'
import { Platform, useWindowDimensions, ViewStyle } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

interface BallProps {
  size: number
  onPress?: () => void
  style?: ViewStyle
}

export function Ball({ size, onPress, style, children }: PropsWithChildren<BallProps>) {
  const barHeight = Platform.OS === 'android' ? statusBarHeight() : 0
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const transf = useSharedValue({ x: 0, y: 0 })
  const x = useSharedValue(16)
  const y = useSharedValue(barHeight)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: transf.value.x }, { translateY: transf.value.y }],
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
      x.value = withSpring(e.absoluteX - e.x > (windowWidth - size) / 2 ? windowWidth - size - 16 : 16, {
        stiffness: 500,
        overshootClamping: true,
      })
      y.value = e.absoluteY + offsetY - e.y
      y.value = Math.min(Math.max(barHeight, y.value), windowHeight - size)
    })

  return (
    <Animated.View style={floatStyles}>
      <GestureHandlerRootView>
        <GestureDetector gesture={Gesture.Simultaneous(dragGesture, singleTap)}>
          <Animated.View style={[style, { width: size, height: size }, animatedStyles]}>{children}</Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  )
}
