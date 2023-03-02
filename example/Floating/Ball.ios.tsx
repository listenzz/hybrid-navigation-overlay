import { statusBarHeight } from 'hybrid-navigation'
import React, { PropsWithChildren } from 'react'
import { useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { BallProps } from './types'

export function Ball({ anchor, children, onPress, onPositionChange = () => {} }: PropsWithChildren<BallProps>) {
  const barHeight = statusBarHeight()
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const gap = 8

  const x = useSharedValue(anchor.x)
  const y = useSharedValue(anchor.y)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
      width: anchor.size,
      height: anchor.size,
      borderRadius: anchor.size / 2,
      overflow: 'hidden',
    }
  })

  const floatStyles = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
    }
  })

  const singleTap = Gesture.Tap()
    .maxDistance(2)
    .onEnd(runOnJS(() => onPress?.()))

  const dragGesture = Gesture.Pan()
    .onChange(e => {
      x.value = e.changeX + x.value
      y.value = e.changeY + y.value
    })
    .onFinalize(e => {
      x.value = e.absoluteX - e.x
      const finalX = x.value > (windowWidth - anchor.size) / 2 ? windowWidth - anchor.size - gap : gap
      x.value = withSpring(finalX, {
        stiffness: 500,
        overshootClamping: true,
      })
      y.value = e.absoluteY - e.y
      const finalY = Math.min(Math.max(barHeight, y.value), windowHeight - anchor.size - 34)
      y.value = withSpring(finalY, {
        stiffness: 500,
        overshootClamping: true,
      })

      runOnJS(onPositionChange)(finalX, finalY)
    })

  return (
    <Animated.View style={floatStyles}>
      <GestureHandlerRootView>
        <GestureDetector gesture={Gesture.Simultaneous(dragGesture, singleTap)}>
          <Animated.View style={animatedStyles}>{children}</Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  )
}
