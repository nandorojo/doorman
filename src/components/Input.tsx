import React, { ComponentPropsWithoutRef } from 'react'
import { TextInput, TextStyle } from 'react-native'

type Props = {
  style?: TextStyle
  /**
   * Background color for the text input
   */
  backgroundColor?: string
  /**
   * Define which premade style type for the input you would like.
   *
   * `elevated` has dropshadow and a colored background that contrasts with the screen background.
   * `flat` has a transparent background and is more subtle.
   */
  type?: 'elevated' | 'flat'
  /**
   * Text color for the text input
   */
  textColor?: string
  textAlign?: TextStyle['textAlign']
} & Omit<ComponentPropsWithoutRef<typeof TextInput>, 'style'>

const Input = (props: Props) => {
  const {
    style,
    backgroundColor = 'white',
    type = 'elevated',
    textColor = 'black',
    textAlign,
    ...inputProps
  } = props
  const inputStyles: {
    [key in typeof type]: TextStyle
  } = {
    elevated: {
      backgroundColor: backgroundColor ?? 'white',
      borderRadius: 5,
      // fontSize: 20,
      fontWeight: 'bold',
      color: textColor ?? 'black',
    },
    flat: {
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      color: textColor ?? 'white',
    },
  }
  return (
    <TextInput
      style={[
        {
          padding: 16,
          fontSize: 24,
          fontWeight: 'bold',
          color: textColor,
          textAlign,
          ...inputStyles[type],
        },
        style,
      ]}
      {...inputProps}
    />
  )
}

export default Input
