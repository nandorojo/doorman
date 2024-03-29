import React, {
  useCallback,
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useMemo,
} from 'react'
import {
  View,
  ViewStyle,
  ScrollView,
  Text,
  Alert,
  TextStyle as TextStyleType,
  Keyboard,
  Platform,
  TextStyle,
} from 'react-native'
import type { TextInput } from 'react-native'
import { empty } from '../utils/empty'
import { ScreenStyle } from '../style/screen'
import { Page } from '../components/Page'
import { useTextStyle } from '../hooks/use-style'

import { PhoneInput, H1, Paragraph } from '../components'
import { CommonScreenProps } from './types'
import { ScreenBackground } from '../components/Background'

type Props = CommonScreenProps & {
  error?: string | null
  renderError?: ((error: string) => ReactNode) | null
  /**
   * Phone number's current state. Used with the `usePhoneNumber` hook.
   *
   * To have this logic fully handled for you, see the `AuthFlow component.
   */
  phoneNumber: string
  /**
   * Callback function invoked whenever the user types a new phone number. Used with the `usePhoneNumber` hook.
   *
   * To have this logic fully handled for you, see the `AuthFlow component.
   *
   * @param info
   * @param info.phoneNumber string that is the current phone number
   * @param info.valid boolean that tells you if the current phone number is valid or not. If yes, it's ready to send an SMS to.
   *
   * To have this logic handled for you, see the `AuthFlow component.
   */
  onChangePhoneNumber: (info: { phoneNumber: string }) => void
  /**
   * Callback function called when a user submits their phone number with the send button. Used with the `usePhoneNumber` hook.
   *
   * To have this logic fully handled for you, see the `AuthFlow component.
   *
   * @param info a dictionary
   * @param info.phoneNumber the phone number used to submit
   */
  onSubmitPhone: (info: { phoneNumber: string }) => void
  /**
   * Boolean to indicate if the text is sending / loading. Button shows loading indicator during this time.
   */
  loading?: boolean
  /**
   * Props for the input component.
   */
  inputProps?: Omit<ComponentPropsWithoutRef<typeof TextInput>, 'style'>
  /**
   * Is the current phone number a valid one to send a text to.
   */
  valid?: boolean
  /**
   * Props for the scroll view containing the whole screen. For styles, see `containerStyle`
   */
  containerProps?: Omit<ComponentPropsWithoutRef<typeof ScrollView>, 'style'>
  /**
   * Style the outer screen.
   */
  containerStyle?: ViewStyle
  /**
   * Style the text input.
   */
  inputStyle?: TextStyle
  /**
   * The color used for the screens color scheme, such as highlighting the text. This prop is getting phased out, so instead, check out the other style props.
   */
  tintColor?: string
  /**
   * Text to show inside the button. Defaults to send.
   */
  buttonText?: string | 'Send' | 'Submit'
  /**
   * Props passed onto the react-native-paper button component.
   */
  // buttonProps?: Omit<
  //   ComponentPropsWithoutRef<typeof Button>,
  //   'children' | 'style'
  // >
  /**
   * Custom styles for the send button.
   */
  // buttonStyle?: ComponentPropsWithoutRef<typeof Button>['style']
  /**
   * (Optional) Title to show at the top. Default: "Enter your phone number"
   */
  title?: string
  /**
   * (Optional) Message that shows under the title and above the input. Default: "We'll send you a text with a code to confirm it's you."
   */
  message?: string
  /**
   * (Optional) Disclaimer that shows under the text input to comply with SMS guidelines. Default: "By tapping <BUTTON_TEXT>, an SMS may be sent. Message & data rates may apply." where BUTTON_TEXT is "Send" by default, but controlled by the `buttonText` prop.
   *
   * Can also be a function, where it receives a dictionary as its only argument, with a `buttonText` field. The function is useful to dynamically let the text update based on the buttonText, and is the more recommended usage.
   *
   * Here is an example used by the **Memezy** app:
   *
   * @example
   * ```jsx
   * export default () => {
   * 	return (
   * 	 <AuthFlow.PhoneScreen
   *     disclaimer={({ buttonText }) => `When you press "${buttonText}", we'll send you a text. Message & data rates may apply. Reply chill to stop.`}
   *   />
   *  )
   * }
   * ```
   */
  disclaimer?: string | ((info: { buttonText: string }) => string)
  /**
   * Optional custom color for the disclaimer text.
   *
   * If you want more generalized color editing, see `textColor` prop.
   */
  disclaimerColor?: string
  /**
   * (Optional) If someone presses "Send" and their number is invalid, an alert will pop up with this message.
   *
   * Default: "Please enter a valid phone number."
   *
   */
  invalidNumberAlertText?: string
  /**
	 * Optional function to replace the default button. It currently receives the props for `react-native-paper`'s Button component, where the `children` prop is the text. See their docs for more.
	 *
	 * It also receives the following props:
	 * - `valid`: is the phone number currently valid
	 * - `loading`: is the SMS sending to the user
	 * - `submit`: this function triggers the `onSubmitPhone` callback prop with the current phone number.
	 *
	 * @example
	 * ```jsx
	 * import { Button } from 'react-native-paper'
	 *import { ScreenBackground } from '../components/Background'

	 * export default () => {
	 * 	return (
	 * 	 <AuthFlow.PhoneScreen
	 *     renderButton={({ valid, loading, submit, ...props }) => <Button {...props} {...yourOtherPropsHere} onPress={valid && !loading ? submit : undefined} />}
	 *     ...
	 *   />
	 *  )
	 * }
	 * ```
	 */
  renderButton?: (
    props: {
      valid: boolean
      submit: () => void
      onPress: () => void
      loading: boolean
    }
  ) => ReactNode
  /**
   * A two-letter country code for formatting `value`
   * when a user inputs a national phone number (example: `(213) 373-4253`).
   * The user can still input a phone number in international format.
   * Default example: "US".
   */
  // defaultCountry?: ComponentPropsWithoutRef<
  // 	typeof ReactPhoneInput
  // >['defaultCountry']
  /**
   * Function to render a custom input component.
   *
   * By default, uses react-native-phone-input on mobile and react-phone-number-input on web.
   */
  renderInput?: (props: {
    value: string
    onChangeText: (phoneNumber: string) => void
  }) => ReactNode
  /**
   * Default: `true`.
   *
   * If true, the send button & disclaimer will only appear for valid phone numbers.
   */
  hideButtonForInvalidNumber?: boolean
  /**
   * The type of button you want.
   *
   * The options are: `fixed-bottom` and `normal`. If it's fixed at the bottom, it goes up when the keyboard opens and is large.
   *
   * 🚨**Note:** 🚨 If you choose `fixed-bottom`, and you are using React Navigation's stack, you might face bugs when they keyboard opens. The solution is to make your header transparent on this React Navigation screen.
   * See: https://reactnavigation.org/docs/stack-navigator/#headertransparent
   */
  buttonType?: 'fixed-bottom' | 'normal'
  /**
   * (Optional) custom text that shows up in the header at the top. Default: `Sign In`. For nothing, put an empty string.
   */
  headerText?: string
  /**
   * Custom background color for the send button. Defaults to the `tintColor` prop if not set.
   */
  buttonBackgroundColor?: string
  /**
   * Custom text color for the send button. Defaults to the `white` prop if not set.
   */
  buttonTextColor?: string
  /**
   * Function to render a custom title. By default, uses the internal `H1` component.
   */
  renderTitle?: (props: { children: string; style?: any }) => ReactNode
  /**
   * Function to render a custom message. By default, uses the internal `P` component.
   */
  renderMessage?: (props: { children: string; style?: any }) => ReactNode
}

export const PhoneAuth = (props: Props) => {
  const {
    phoneNumber,
    onChangePhoneNumber,
    onSubmitPhone,
    valid = false,
    inputProps = empty.object,
    containerProps = empty.object,
    containerStyle,
    inputStyle,
    tintColor = '#6200ee',
    loading = false,
    buttonText = 'Send', 
    title = 'Enter your phone number',
    message = `We'll send you a text with a code to confirm it's you.`,
    disclaimer = `By tapping "${buttonText}", an SMS may be sent. Message & data rates may apply.`,
    invalidNumberAlertText = 'Please enter a valid phone number.',
    renderButton,
    hideButtonForInvalidNumber = true,
    backgroundColor,
    renderBackground,
    renderHeader,
    buttonType,
    disableKeyboardHandler,
    textAlign = 'center',
    headerText = 'Sign In',
    headerBackgroundColor = 'transparent',
    textColor = 'white',
    disclaimerColor,
    headerTintColor,
    renderInput,
    inputBackgroundColor,
    inputTextColor,
    inputContainerStyle,
    inputType = 'elevated',
    buttonBackgroundColor,
    buttonTextColor,
    headerTitleStyle = empty.object,
    renderHeaderTitle,
    renderMessage,
    renderTitle,
    titleStyle,
    messageStyle,
    error,
    renderError,
  } = props

  const shouldButtonShow = !(!valid && hideButtonForInvalidNumber)

  const TextStyle = useTextStyle()

  useEffect(() => {
    const validateProps = () => {
      if (disableKeyboardHandler && buttonType === 'fixed-bottom') {
        console.warn(
          '🚨Doorman Warning: You set your buttonType prop to fixed-bottom, and set disableKeyboardHandler to true. \n\nThis will cause bugs. Set the disableKeyboardHandler prop to false if you want to use the fixed-bottom buttonType.'
        )
      }
    }
    validateProps()
  }, [disableKeyboardHandler, buttonType])

  const submit = useCallback(() => onSubmitPhone({ phoneNumber }), [
    phoneNumber,
    onSubmitPhone,
  ])

  const button = useCallback(() => { 
    if (renderButton) return renderButton({ loading, onPress() {
      if (!shouldButtonShow) return

      if (!valid) {
        Alert.alert(invalidNumberAlertText)
      } else if (!loading) {
        Keyboard.dismiss()
        submit()
      }
    }, valid, submit })

    console.error('[PhoneScreen] renderButton is required')

    return null
 
  }, [invalidNumberAlertText, loading, renderButton, shouldButtonShow, submit, valid])

  const renderDisclaimer = useCallback(() => {
    if (typeof disclaimer === 'function') {
      return disclaimer({ buttonText })
    }
    return (
      <Text
        style={[
          TextStyle.disclaimer,
          { textAlign, color: disclaimerColor ?? textColor },
        ]}
      >
        {disclaimer}
      </Text>
    )
  }, [
    TextStyle.disclaimer,
    buttonText,
    disclaimer,
    disclaimerColor,
    textAlign,
    textColor,
  ])
  const input = useCallback(() => {
    if (renderInput)
      return renderInput({
        value: phoneNumber,
        onChangeText: phoneNumber => onChangePhoneNumber({ phoneNumber }),
      })

    const inputStyles: {
      [key in typeof inputType | 'common']: {
        style: ViewStyle
        textStyle: TextStyleType
      }
    } = {
      elevated: {
        style: {
          backgroundColor: inputBackgroundColor ?? 'white',
          borderRadius: 5,
          ...inputStyle,
        },
        textStyle: {
          // fontSize: 20,
          fontWeight: 'bold',
          color: inputTextColor ?? 'black',
        },
      },
      flat: {
        style: {
          borderBottomColor: 'white',
          borderBottomWidth: 1,
        },
        textStyle: {
          color: inputTextColor ?? 'white',
        },
      },
      common: {
        style: {
          padding: 16,
          paddingVertical: 24,
        },
        textStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: inputTextColor,
          // fixes the bug of text getting vertically cut-off
          height: 'auto',
        },
      },
    }
    return (
      <PhoneInput
        value={phoneNumber}
        onChangePhoneNumber={onChangePhoneNumber}
        inputProps={{
          // autoFocus: true,
          ...Platform.select({
            web: empty.object,
            default: {
              selectionColor: tintColor,
              placeholderTextColor:
                inputType === 'elevated' ? '#00000070' : '#ffffff70',
              keyboardAppearance: 'dark',
            },
          }),
          placeholder: 'Phone number',
          // selectionColor: Platform.select({
          // 	web: undefined,
          // 	default: tintColor,
          // }),
          // placeholderTextColor: Platform.select({
          // 	web: undefined,
          // 	default: inputType === 'elevated' ? '#00000070' : '#ffffff70',
          // }),
          // keyboardAppearance: Platform.select({
          // 	web: undefined,
          // 	default: 'dark',
          // }),
          autoFocus: true,
          ...inputProps,
        }}
        onSubmit={submit}
        textStyle={{
          ...inputStyles.common.textStyle,
          ...inputStyles[inputType].textStyle,
        }}
        style={{ ...inputStyles.common.style, ...inputStyles[inputType].style }}
      />
    )
  }, [
    renderInput,
    phoneNumber,
    onChangePhoneNumber,
    inputType,
    inputBackgroundColor,
    inputStyle,
    inputTextColor,
    tintColor,
    inputProps,
    submit,
  ])

  const background = useCallback(() => {
    if (renderBackground === null) return null
    if (renderBackground) return renderBackground()

    return <ScreenBackground color={backgroundColor} />
  }, [renderBackground, backgroundColor])

  const header = useCallback(() => {
    if (renderHeader === null) return null
    if (renderHeader)
      return renderHeader({
        screen: 'phone',
        goBack: () => {
          console.warn(
            '[react-native-doorman][phoneScreenProps.renderHeader] calling goBack() from the phone screen does nothing. You probably meant to do this from confirmScreen. Make sure to check that screen === "code".'
          )
        },
      })


    console.error('[PhoneScreen] renderHeader must be a function or null')

    return null


    // return (
    //   <Header
    //     containerStyle={{
    //       backgroundColor: headerBackgroundColor,
    //       justifyContent: textAlign === 'left' ? 'space-between' : 'center',
    //       borderBottomWidth: 0,
    //     }}
    //     {...headerProps}
    //     centerComponent={
    //       renderHeaderTitle?.() ?? {
    //         text: headerText,
    //         style: {
    //           color: headerTintColor ?? textColor,
    //           ...headerTitleStyle,
    //           fontWeight: '500',
    //           fontSize: 18,
    //         },
    //       }
    //     }
    //   />
    // )
  }, [renderHeader])

  const _renderTitle = () => {
    const titleProps: Parameters<Required<Props>['renderTitle']>[0] = {
      style: [{ textAlign, color: textColor }, titleStyle],
      children: title,
    }
    if (typeof renderTitle === 'function') {
      return renderTitle(titleProps)
    }

    return <H1 {...titleProps} />
  }

  const _renderMessage = () => {
    const messageProps: Parameters<Required<Props>['renderMessage']>[0] = {
      style: [{ textAlign, color: textColor }, messageStyle],
      children: message,
    }
    if (typeof renderMessage === 'function') {
      return renderMessage(messageProps)
    }

    return <Paragraph {...messageProps} />
  }

  const _renderError = useMemo(() => {
    if (!error || !renderError) return null
    return renderError(error)
  }, [error, renderError])

  return (
    <Page
      header={header}
      containerProps={containerProps}
      style={containerStyle}
      background={background}
      disableKeyboardHandler={disableKeyboardHandler}
    >
      <View>
        {/* <H1 style={{ textAlign, color: textColor }}>{title}</H1> */}
        {_renderTitle()}
        {/* <Paragraph style={{ textAlign, color: textColor }}>{message}</Paragraph> */}
        {_renderMessage()}
        <View style={[styles.inputContainer, inputContainerStyle]}>
          {input()}
        </View>
        <View
          style={{
            opacity: shouldButtonShow ? 1 : 0,
            transform: [{ translateY: shouldButtonShow ? 0 : 5 }],
            ...Platform.select({
              web: {
                transition: `opacity 0.2s ease-in-out, transform 0.2s ease-in-out`
              }
            })
          }}
        >
          <View style={styles.buttonWrapper}>{button()}</View>
          {renderDisclaimer()}
        </View>
        {_renderError}
      </View>
    </Page>
  )
}

const styles = ScreenStyle
