import React, { useEffect } from 'react'
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Anchor } from './types'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const menus = ['菜单1 菜单1 菜单1', '菜单2', '菜单3']

interface MenuProps {
  anchor: Anchor
  renderAnchor?: () => React.ReactNode
  onClose?: () => void
}

export default function Menu({ anchor, onClose = () => {}, renderAnchor }: MenuProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const menuWidth = Math.max(280, windowWidth - 120)
  const menuHeight = 48 * menus.length
  const menuLeft = (windowWidth - menuWidth) / 2
  const menuTop = Math.min(anchor.y + 16, windowHeight - menuHeight - 50)

  const x = useSharedValue(anchor.x)
  const y = useSharedValue(anchor.y)
  const width = useSharedValue(anchor.size)
  const height = useSharedValue(anchor.size)

  const alpha = useSharedValue(0)
  const radius = useSharedValue(anchor.size / 2)

  const maskAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: alpha.value,
    }
  })

  const menuAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: x.value,
      top: y.value,
      width: width.value,
      height: height.value,
      borderRadius: radius.value,
    }
  })

  const anchorAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - alpha.value,
    }
  })

  // 收起
  const collapse = () => {
    x.value = withTiming(anchor.x, { duration: 200 })
    y.value = withTiming(anchor.y, { duration: 200 })
    width.value = withTiming(anchor.size, { duration: 200 })
    height.value = withTiming(anchor.size, { duration: 200 })

    alpha.value = withTiming(0, { duration: 200 })
    radius.value = withTiming(anchor.size / 2, { duration: 200 }, () => {
      runOnJS(onClose)()
    })
  }

  // 展开
  const expand = () => {
    x.value = withTiming(menuLeft, { duration: 200 })
    y.value = withTiming(menuTop, { duration: 200 })
    width.value = withTiming(menuWidth, { duration: 200 })
    height.value = withTiming(menuHeight, { duration: 200 })

    alpha.value = withTiming(1, { duration: 200 })
    radius.value = withTiming(16, { duration: 200 })
  }

  useEffect(() => {
    expand()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function renderMenuItem(text: string) {
    return (
      <Pressable style={styles.item} key={text} onPress={collapse}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    )
  }

  function renderThumb() {
    return (
      <View style={styles.thumb}>
        <Text>Anchor</Text>
      </View>
    )
  }

  return (
    <View style={styles.fill}>
      <AnimatedPressable style={[styles.mask, maskAnimatedStyle]} onPress={collapse} />
      <Animated.View style={[styles.menu, menuAnimatedStyle]}>
        {menus.map(renderMenuItem)}
        <Animated.View style={[StyleSheet.absoluteFillObject, anchorAnimatedStyle]} pointerEvents="none">
          {renderAnchor ? renderAnchor() : renderThumb()}
        </Animated.View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  item: {
    height: 48,
    justifyContent: 'center',
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  text: {
    color: '#222222',
    fontSize: 17,
  },
  thumb: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
