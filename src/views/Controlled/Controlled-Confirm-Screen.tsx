import React, { ComponentPropsWithoutRef, useCallback } from 'react'
import { ConfirmScreen } from '../Confirm-Screen'
import {
  useConfirmPhone,
  useAuthFlowState,
  signInWithCustomTokenHeadless,
  HeadlessFirebaseUser,
} from 'react-doorman'

type Props = Omit<
  ComponentPropsWithoutRef<typeof ConfirmScreen>,
  | 'onChangeCode'
  | 'onPressResendCode'
  | 'loading'
  | 'code'
  | 'phoneNumber'
  | 'error'
  | 'resend'
  | 'resending'
> & {
  /**
   * Optional callback function called whenever a user successfully confirms their phone number.
   *
   * You might want to use this to add to your analytics, for instance.
   *
   * `onCodeVerified` gets called _before_ `onUserSuccessfullySignedIn`. If you want to call a function after signing in, use `onUserSuccessfullySignedIn` instead.
   *
   * @example
   * ```es6
   * <AuthFlow.PhoneScreen onCodeVerified={({ token }) => analytics.track('Code Success')} />
   * ```
   */
  onCodeVerified?: (info: { token: string }) => void
  /**
   * Optional callback function called whenever a user successfully signs in to the firebase app.
   *
   * This function gets called _after_ `onCodeVerified`. If you don't care about when the user signed in, but instead only a correct phone entry, use `onCodeVerified`.
   *
   * @example
   * ```es6
   * <AuthFlow.PhoneScreen onCodeVerified={({ token }) => analytics.track('Code Success')} />
   * ```
   */
  onUserSuccessfullySignedIn?: (info: {
    user: HeadlessFirebaseUser | null
  }) => void
}

export default function ControlledConfirmScreen(props: Props) {
  const { phoneNumber } = useAuthFlowState()
  const {
    code,
    onChangeCode,
    loading,
    error,
    resend,
    resending,
  } = useConfirmPhone({
    onCodeVerified: async ({ token }) => {
      if (token) {
        // sign the user in
        props.onCodeVerified?.({ token })
        signInWithCustomTokenHeadless(token).then(({ user }) => {
          props.onUserSuccessfullySignedIn?.({ user })
        })
      }
    },
    phoneNumber,
  })
  const onPressResendCode = useCallback(async () => {
    const { success } = await resend()
    if (success) {
      alert(`✅ 6-digit code was resent to ${phoneNumber}.`)
    }
  }, [phoneNumber, resend])

  return (
    <ConfirmScreen
      {...{ code, onChangeCode, loading, error, resending }}
      phoneNumber={phoneNumber}
      onPressResendCode={onPressResendCode}
      {...props}
    />
  )
}
