import React, {
  ComponentPropsWithoutRef,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import ControlledPhoneAuth from './Controlled-Phone-Screen'
import ControlledConfirmPhone from './Controlled-Confirm-Screen'
import { empty } from '../../utils/empty'
import { useDoormanTheme } from '../../hooks/use-doorman-theme'
import { CommonScreenProps } from '../types'
import { StyleSheet, Platform, View } from 'react-native'
import { useAuthFlowState } from 'react-doorman'

type Props = {
  phoneScreenProps?: Omit<
    ComponentPropsWithoutRef<typeof ControlledPhoneAuth>,
    'onSmsSuccessfullySent'
  >
  confirmScreenProps?: Omit<
    ComponentPropsWithoutRef<typeof ControlledConfirmPhone>,
    'tintColor' | 'onCodeVerified' | 'onUserSuccessfullySignedIn'
  >
  onUserSuccessfullySignedIn?: ComponentPropsWithoutRef<
    typeof ControlledConfirmPhone
  >['onUserSuccessfullySignedIn']
  onCodeVerified?: ComponentPropsWithoutRef<
    typeof ControlledConfirmPhone
  >['onCodeVerified']
  onSmsSuccessfullySent?: ComponentPropsWithoutRef<
    typeof ControlledPhoneAuth
  >['onSmsSuccessfullySent']
} & CommonScreenProps

export function AuthFlow(props: Props) {
  const { tintColor } = useDoormanTheme()
  const { setCodeScreenReady, ready } = useAuthFlowState()

  const {
    phoneScreenProps = empty.object,
    confirmScreenProps = empty.object,
    onCodeVerified,
    onUserSuccessfullySignedIn,
    onSmsSuccessfullySent: onSent,
    ...otherProps
  } = props

  const commonScreenProps: CommonScreenProps = {
    ...otherProps,
  }

  const sendCallback = useRef(onSent)
  useEffect(() => {
    sendCallback.current = onSent
  })

  const onSmsSuccessfullySent = useCallback(
    (info: { phoneNumber: string }) => {
      sendCallback.current?.(info)
      setCodeScreenReady(true)
    },
    [setCodeScreenReady]
  )
  const onGoBack = useCallback(() => setCodeScreenReady(false), [
    setCodeScreenReady,
  ])

  return (
    <View style={styles.container}>
      {!ready ? (
        <>
          <ControlledPhoneAuth
            {...commonScreenProps}
            {...phoneScreenProps}
            onSmsSuccessfullySent={onSmsSuccessfullySent}
            tintColor={tintColor}
          />
        </>
      ) : (
        <>
          <ControlledConfirmPhone
            {...commonScreenProps}
            {...confirmScreenProps}
            onGoBack={onGoBack}
            onCodeVerified={onCodeVerified}
            onUserSuccessfullySignedIn={onUserSuccessfullySignedIn}
          />
        </>
      )}
    </View>
  )
}

AuthFlow.PhoneScreen = ControlledPhoneAuth
AuthFlow.ConfirmScreen = ControlledConfirmPhone

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
