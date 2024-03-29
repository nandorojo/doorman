import React, {
  ReactNode,
  ComponentPropsWithoutRef,
  useCallback,
  useMemo,
} from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextStyle as TextStyleType,
  ViewStyle,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { ScreenStyle } from '../style/screen'
import { TextStyle } from '../style/text'
import { Page } from '../components/Page'
import { Paragraph, H1 } from '../components'
import { empty } from '../utils/empty'
import { CommonScreenProps } from './types'
import { ScreenBackground } from '../components/Background'
import { Input } from '../components/Input'

type Props = CommonScreenProps & {
  code: string
  /**
   * Required prop: Function called every time the code is changed. It is recommended to use this with the `useConfirmPhone` hook.
   *
   * To have this logic fully handled for you, see the `AuthFlow.ConfirmScreen` component. Or, for an even simpler experience, see the `AuthFlow` stack.
   *
   * @example
   * ```jsx
   * import * as React from 'react'
   * import { useConfirmPhone, ConfirmScreen } from 'react-native-doorman'
   *
   * export default function ConfirmScreen(props) {
   * 	const { code, onChangeCode, reset, loading } = useConfirmPhone({ phoneNumber: props.phoneNumber })
   *
   * 	return (
   * 		<ConfirmPhone
   * 			{...{ code, onChangeCode, loading }}
   * 			phoneNumber={props.phoneNumber}
   * 		/>
   * 	)
   * }
   * ```
   *
   */
  onChangeCode: (code: string) => void
  /**
	 * (Optional) Boolean to show if it's loading. If true, shows a loading indicator. It is recommended to use this with the `useConfirmPhone` hook.
	 *
	 * To have this logic fully handled for you, see the `AuthFlow.ConfirmScreen` component. Or, for an even simpler experience, see the `AuthFlow` stack.
	 *
	 *  * @example
	 * ```jsx
	 * import * as React from 'react'
	 * import { useConfirmPhone, ConfirmScreen } from 'react-native-doorman'
import Input from '../components/Input'

	 * export default function ConfirmScreen(props) {
	 * 	const { code, onChangeCode, reset, loading } = useConfirmPhone({ phoneNumber: props.phoneNumber })
	 *
	 * 	return (
	 * 		<ConfirmPhone
	 * 			{...{ code, onChangeCode, loading }}
	 * 			phoneNumber={props.phoneNumber}
	 * 		/>
	 * 	)
	 * }
	 * ```
	 *
	 */
  loading?: boolean
  /**
   * **Required** `phoneNumber` that the 6-digit code was sent to. You should have this value from the previous screen, `PhoneAuth`. To have this logic between screens all handled for you, see the `AuthFlow` component.
   *
   */
  phoneNumber: string
  /**
   * (Optional prop) Message that will show up above the code input. This should tell your user that they just received a code to their phone, and that it should show up below.
   *
   * Can either be a string, or a function.
   *
   * If you pass a function, it receives one argument: a dictionary with a `phoneNumber` value. The function should return a string or React Native <Text /> node.
   *
   * @default
   * ```es6
   * 	const defaultMessage = ({phoneNumber}) => `We just sent a 6-digit code to ${phoneNumber}. Enter it below to continue.`
   * ```
   *
   * @example
   * ```jsx
   *
   * export default () => {
   * 	return <ConfirmPhone message={({ phoneNumber }) => `Check ${phoneNumber} for a text!`} />
   * }
   * ```
   */
  message?: string | ((info: { phoneNumber: string }) => ReactNode)
  /**
   * Callback function called when user presses "Resent Code" button
   */
  onPressResendCode?: (info: { phoneNumber: string }) => void
  /**
   * Override text for button that lets users to resend code.
   *
   * Default: `Resend Code`
   */
  resendText?: string
  /**
   * Boolean to indicate if resending the code is loading.
   *
   * Used with the `useConfirmPhone` hook.
   */
  resending?: boolean
  /**
   * Text style prop for the resend text. If you just want to change the color, see the `tintColor` prop.
   */
  resendStyle?: TextStyleType
  /** */
  // onReset?: () => void
  // tintColor?: string
  /**
   * Header text that appears at the top.
   *
   * Default: Enter code
   */
  title?: string
  /**
   * If there is a network error message
   */
  error?: string | null
  /**
   * Text style for the `error` message prop.
   */
  errorStyle?: TextStyleType
  /**
   * Props for the scroll view containing the whole screen. For styles, see `containerStyle`
   */
  containerProps?: Omit<ComponentPropsWithoutRef<typeof ScrollView>, 'style'>
  /**
   * Style the outer screen.
   */
  containerStyle?: ViewStyle
  /**
   * Default: `Confirm Code`. Set empty string to remove.
   *
   * You can also see these props: `renderHeaderTitle`, or `renderHeader`, or `headerProps`.
   */
  headerText?: string
  /**
   * Optionally render your own custom loader when a code verification is loading.
   */
  renderLoader?: () => ReactNode
  /**
   * Function that gets called when the back arrow is pressed.
   */
  onGoBack?: () => void
  /**
   * Optional color for the activity indicator when a message is sending. See also: `renderLoader` prop.
   */
  loaderColor?: string
  /**
   * Optional styles for the TextInput component.
   */
  inputStyle?: TextStyleType
  /**
   * Custom TextInput props. Note that there are many other props to customize the input. Do a page find for `input` to find them.
   */
  inputProps?: React.ComponentProps<typeof Input>

  renderError?: (error: string) => ReactNode
}

function Confirm(props: Props) {
  const {
    code,
    onChangeCode,
    loading,
    phoneNumber,
    message,
    title = 'Enter Code',
    error,
    errorStyle,
    resending,
    resendText = 'Resend Code',
    containerProps = empty.object,
    containerStyle,
    renderBackground,
    backgroundColor,
    renderHeader,
    textAlign = 'center',
    textColor = 'white',
    resendStyle,
    renderLoader,
    inputBackgroundColor = 'white',
    inputContainerStyle,
    inputTextColor = 'black',
    inputType = 'elevated',
    onGoBack,
    onPressResendCode,
    loaderColor,
    inputStyle = empty.object,
    inputProps = empty.object,
    titleStyle,
    messageStyle,
    disableKeyboardHandler,
    renderError: renderErrorProp,
  } = props

  const renderMessage = useMemo(() => {
    if (message) {
      return (
        <Paragraph
          style={[
            styles.subtitle,
            { color: textColor, textAlign },
            messageStyle,
          ]}
        >
          {typeof message === 'function' ? message({ phoneNumber }) : message}
        </Paragraph>
      )
    }

    return (
      <Paragraph
        style={[styles.subtitle, { color: textColor, textAlign }, messageStyle]}
      >
        We just sent a 6-digit code to{' '}
        <Paragraph style={styles.number}>{phoneNumber}</Paragraph>. Enter it
        below to continue.
      </Paragraph>
    )
  }, [message, messageStyle, phoneNumber, textAlign, textColor])
  const renderInput = useMemo(() => {
    return (
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <Input
          value={code}
          onChangeText={onChangeCode}
          editable={!loading}
          maxLength={6}
          clearButtonMode="while-editing"
          placeholder="6-digit code"
          textContentType="oneTimeCode"
          keyboardType="number-pad"
          accessibilityHint="6-digit phone number texted to you"
          returnKeyType="done"
          autoFocus
          style={inputStyle}
          textColor={inputTextColor}
          backgroundColor={inputBackgroundColor}
          type={inputType}
          textAlign={textAlign}
          {...inputProps}
        />
      </View>
    )
  }, [
    code,
    inputBackgroundColor,
    inputContainerStyle,
    inputProps,
    inputStyle,
    inputTextColor,
    inputType,
    loading,
    onChangeCode,
    textAlign,
  ])

  const renderResend = useMemo(
    () =>
      !loading && onPressResendCode ? (
        <>
          <TouchableOpacity
            disabled={resending}
            onPress={() => onPressResendCode?.({ phoneNumber })}
          >
            <Paragraph
              style={[
                { color: textColor },
                styles.resend as TextStyleType,
                resendStyle,
              ]}
            >
              {resending ? 'Resending code...' : resendText}
            </Paragraph>
          </TouchableOpacity>
        </>
      ) : null,
    [
      loading,
      phoneNumber,
      onPressResendCode,
      resendStyle,
      resendText,
      resending,
      textColor,
    ]
  )

  const loader = useMemo(
    () =>
      !!loading &&
      (renderLoader?.() || (
        <View style={{ marginVertical: 8 }}>
          <ActivityIndicator
            animating={loading}
            color={loaderColor ?? textColor}
          />
        </View>
      )),
    [loading, renderLoader, textColor, loaderColor]
  )

  const renderError = useMemo(() => {
    return (
      <View
        style={{
          opacity: error ? 1 : 0,
          transform: [
            {
              translateY: error ? 5 : 0,
            },
          ],
          ...Platform.select({
            web: {
              transition: `opacity 0.2s ease-in-out, transform 0.2s ease-in-out`,
            },
          }),
        }}
      >
        {(!!error && renderErrorProp?.(error)) || (
          <Text
            style={[
              {
                textAlign,
              },
              styles.error,
              errorStyle,
            ]}
          >
            {error}. Please try resending the code.
          </Text>
        )}
      </View>
    )
  }, [error, errorStyle, renderErrorProp, textAlign])

  const background = useCallback(() => {
    if (renderBackground === null) return null
    if (renderBackground) return renderBackground()

    return <ScreenBackground color={backgroundColor} />
  }, [renderBackground, backgroundColor])

  const header = useCallback(() => {
    if (renderHeader === null) return null
    if (renderHeader)
      return renderHeader({
        screen: 'code',
        goBack:
          onGoBack ??
          (() => {
            console.warn(
              '[react-native-doorman.confirm-screen][renderHeader] goBack function was called, but the onGoBack prop was not provided to <AuthFlow.ConfirmScreen />. This means nothing will happen. You should probably use the <AuthFlow /> component if you need this.'
            )
          }),
      })

    console.error('[ConfirmScreen] renderHeader must be a function or null')

    return null
  }, [renderHeader, onGoBack])
  const renderTitle = useMemo(() => {
    return (
      <H1 style={[{ textAlign, color: textColor }, titleStyle]}>{title}</H1>
    )
  }, [textAlign, textColor, title, titleStyle])

  return (
    <Page
      header={header}
      background={background}
      containerProps={containerProps}
      style={containerStyle}
      disableKeyboardHandler={disableKeyboardHandler}
    >
      <View style={styles.wrapper}>
        {renderTitle}
        {renderMessage}
        {renderInput}
        {renderResend}
        {loader}
        {renderError}
      </View>
    </Page>
  )
}

export const ConfirmScreen = React.memo(Confirm)

const styles = {
  message: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 18,
  },
  number: {
    fontWeight: 'bold' as 'bold',
    textAlign: 'center' as 'center',
  },
  resend: {
    marginTop: 16,
    textAlign: 'center',
  },
  ...ScreenStyle,
  ...TextStyle,
}
