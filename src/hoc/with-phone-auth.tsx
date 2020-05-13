import React, { ComponentType, ComponentPropsWithoutRef, useState } from 'react'
import {
  DoormanProvider,
  useDoormanContext,
  ProviderProps,
  InitializationProps,
} from 'react-doorman'

import { AuthGate } from '../components/AuthGate'
import { AuthFlow } from '../views'
import ControlledPhoneAuth from '../views/Controlled/Controlled-Phone-Screen'
import ControlledConfirmScreen from '../views/Controlled/Controlled-Confirm-Screen'
import { CommonScreenProps } from '../views/types'

type Options = Omit<ProviderProps, 'children'> & {
  LoadingScreen?: ComponentType
  includeProvider?: boolean
  /**
   * Callback function called when a user's 6-digit code is verified, and they are authenticated.
   *
   * You might want to use this for analytics.
   */
  onCodeVerified?: ComponentPropsWithoutRef<
    typeof ControlledConfirmScreen
  >['onCodeVerified']
  /**
   * Callback function called when the an SMS is successfully sent to the user.
   *
   * Receives a dictionary with the auth `token` value.
   */
  onSmsSuccessfullySent?: ComponentPropsWithoutRef<
    typeof ControlledPhoneAuth
  >['onSmsSuccessfullySent']
  phoneScreenProps?: ComponentPropsWithoutRef<
    typeof AuthFlow
  >['phoneScreenProps']
  confirmScreenProps?: ComponentPropsWithoutRef<
    typeof AuthFlow
  >['confirmScreenProps']
  /**
   * **Required:** Your app's config for doorman.
   *
   * ```javascript
   * {
   *  projectId: string // projectId from firebase
   * }
   * ```
   */
  doorman: InitializationProps
  /**
   * (Optional) Your custom splash screen component that will appear before any auth screens are shown.
   *
   * It receives one prop: a function called `next` that should be called whenever a user wants to continue to the auth screens.
   */
  SplashScreen?: ComponentType<{ next: () => void }>
} & CommonScreenProps

export function withPhoneAuth<P>(
  Component: ComponentType<P & { user: firebase.User }>,
  options: Options
) {
  // return () => null

  const {
    LoadingScreen,
    includeProvider = true,
    // tintColor,
    phoneScreenProps,
    confirmScreenProps,
    doorman,
    SplashScreen,
    theme: themeOption,
    initialPhoneNumber,
    onAuthStateChanged,
    onCodeVerified,
    onSmsSuccessfullySent,
    ...sharedScreenProps
  } = options
  const WithFirebasePhoneAuth = (props: P) => {
    const [splashDone, setSplashDone] = useState(!SplashScreen)

    /**
     * If the context is non-null, this means a provider already exists in the component tree.
     *
     * If it doesn't, we add it ourselves. You can still deny `includeProvider` if you want.
     */
    const providerExistsAlready = useDoormanContext()
    const Provider =
      !providerExistsAlready && includeProvider
        ? DoormanProvider
        : React.Fragment
    return (
      <Provider
        onAuthStateChanged={user => {
          onAuthStateChanged?.(user)
          if (!user) setSplashDone(false)
        }}
        initialPhoneNumber={initialPhoneNumber}
        theme={themeOption}
        {...doorman}
      >
        <AuthGate>
          {({ loading, user }) => {
            if (loading) {
              return LoadingScreen ? <LoadingScreen /> : <></>
            }

            if (user) return <Component {...props} user={user} />

            if (!splashDone && SplashScreen)
              return <SplashScreen next={() => setSplashDone(true)} />

            return (
              <AuthFlow
                {...sharedScreenProps}
                phoneScreenProps={phoneScreenProps}
                confirmScreenProps={confirmScreenProps}
                onSmsSuccessfullySent={onSmsSuccessfullySent}
                onCodeVerified={onCodeVerified}
              />
            )
          }}
        </AuthGate>
      </Provider>
    )
  }
  return WithFirebasePhoneAuth
}
