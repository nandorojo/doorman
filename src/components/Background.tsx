import React, { useMemo } from 'react'
import { CommonScreenProps } from '../views/types'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

type Props = {
  /**
   * Array of colors. If it's multiple items, it will render a gradient.
   */
  color?: CommonScreenProps['backgroundColor']
}

export const ScreenBackground = React.memo(function ScreenBackground(
  props: Props
) {
  const { color = ['#FF2C55', '#7048e8'] } = props

  const backgroundColor: string | undefined =
    typeof color === 'string' ? color : undefined

  const containerStyle = useMemo<ViewStyle[]>(
    () => [styles.container, { backgroundColor }],
    [backgroundColor]
  )

  // if it's a gradient...
  if (Array.isArray(color)) {
    return (
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        colors={color}
        start={[0.1, 0.1]}
        end={[0.9, 0.9]}
      />
    )
  }

  return <View style={containerStyle} />
})

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
})
