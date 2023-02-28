import { statusBarHeight } from 'hybrid-navigation'
import React, { PropsWithChildren } from 'react'
import { useWindowDimensions, ViewStyle } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

interface BallProps {
  size: number
  onPress?: () => void
  style?: ViewStyle
}

export function Ball({ size, onPress, style, children }: PropsWithChildren<BallProps>) {
  const barHeight = statusBarHeight()
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const x = useSharedValue(16)
  const y = useSharedValue(barHeight)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    }
  })

  const floatStyles = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
    }
  })

  const singleTap = Gesture.Tap().onEnd(runOnJS(() => onPress?.()))

  const dragGesture = Gesture.Pan()
    .onChange(e => {
      x.value = e.changeX + x.value
      y.value = e.changeY + y.value
    })
    .onFinalize(e => {
      x.value = e.absoluteX - e.x
      x.value = withSpring(e.absoluteX - e.x > (windowWidth - size) / 2 ? windowWidth - size - 16 : 16, {
        stiffness: 500,
        overshootClamping: true,
      })
      y.value = e.absoluteY - e.y
      y.value = Math.min(Math.max(barHeight, y.value), windowHeight - size - 34)
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
