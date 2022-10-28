import React, { useRef, useEffect, useCallback } from 'react'
import { PhoneInputProps, PhoneInputRef } from './types'
import PhoneInputForm, { isPossiblePhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import { empty } from '../../utils/empty'
import { WebStyles } from './web-styles'

// import './style.css'
// import 'react-phone-number-input/style.css'

const id = 'doorman-phone-input'

type Props = PhoneInputProps

export function PhoneInput(props: Props) {
  const {
    onChangePhoneNumber,
    value,
    disabled,
    textStyle = empty.object,
    style = empty.object,
    inputRef,
    inputProps,
    onSubmit,
  } = props

  const ref = useRef<PhoneInputRef>(null)
  useEffect(() => {
    if (inputRef?.current) inputRef.current = ref.current
  })
  const onChangeText = useCallback(
    (phoneNumber: string) => {
      onChangePhoneNumber({
        phoneNumber,
        valid: isPossiblePhoneNumber(phoneNumber),
      })
    },
    [onChangePhoneNumber]
  )

  return (
    <form
      onSubmit={e => {
        const value = (document.getElementById(id) as any)?.value as string
        e.preventDefault()
        console.log('[phone-input] onSubmit', e)
        if (value) {
          onSubmit?.(value)
        }
      }}
    >
      <WebStyles />
      <PhoneInputForm
        name="phoneInput"
        id={id}
        international={false}
        defaultCountry="US"
        useNationalFormatForDefaultCountryValue
        {...(inputProps as any)}
        style={{ ...style, ...textStyle }}
        value={value}
        onChange={onChangeText}
        flags={flags}
        disabled={disabled}
        autoFocus
        // color="white"
      />
    </form>
  )
}
