import React, { ComponentPropsWithoutRef } from 'react'
import { usePhoneNumber } from 'react-doorman'
import { PhoneAuth } from '../Phone-Screen'

type Props = Omit<
  ComponentPropsWithoutRef<typeof PhoneAuth>,
  'onChangePhoneNumber' | 'onSubmitPhone' | 'phoneNumber' | 'valid' | 'loading'
> & {
  onSmsSuccessfullySent(info: { phoneNumber: string }): void
  onSmsError?: (error: unknown) => void
  /**
   * The initial value of the phone number input before typing.
   * You may want to set this to the prefix for your country.
   * Default: '+1' for US.
   * Set to an empty string if you want none.
   */
  initialPhoneNumber?: string
}

export default function ControlledPhoneAuth(props: Props) {
  const { onSmsSuccessfullySent, onSmsError, ...otherProps } = props

  const {
    phoneNumber,
    onChangePhoneNumber,
    valid,
    submitPhone,
    loading,
    error,
  } = usePhoneNumber({
    onSmsSuccessfullySent,
    onSmsError,
  })

  return (
    <PhoneAuth
      {...otherProps}
      error={error}
      onChangePhoneNumber={onChangePhoneNumber}
      onSubmitPhone={submitPhone}
      phoneNumber={phoneNumber}
      valid={valid}
      loading={loading}
    />
  )
}
