import React, { useRef, useEffect, useCallback } from 'react'
// @ts-ignore
import Input from 'react-native-phone-input'
import { empty } from '../../utils/empty'
import { PhoneInputRef, PhoneInputProps } from './types'

type Props = PhoneInputProps

export function PhoneInput(props: Props) {
  const {
    inputRef,
    value,
    onChangePhoneNumber,
    inputProps = empty.object,
    textStyle,
    style,
  } = props

  const ref = useRef<PhoneInputRef>(null)
  useEffect(() => {
    if (inputRef?.current) inputRef.current = ref.current
  })

  const onChangeText = useCallback(
    (phoneNumber: string) => {
      onChangePhoneNumber({
        phoneNumber,
        valid: !!ref.current?.isValidNumber(),
      })
    },
    [onChangePhoneNumber]
  )

  return (
    // @ts-ignore
    <Input
      textStyle={textStyle}
      style={style}
      ref={ref}
      onChangePhoneNumber={onChangeText}
      value={value}
      textProps={inputProps}
    />
  )
}
