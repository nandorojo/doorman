import React, { useCallback, ComponentPropsWithoutRef, ReactNode } from 'react'
import { View, ViewStyle, ScrollView, Text, Alert } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { empty } from '../utils/empty'
import { TextStyle } from '../style/text'
import { ScreenStyle } from '../style/screen'
import { PhoneInput } from '../components/PhoneInput'

type Props = {
	/**
	 * Phone number's current state. Used with the `usePhoneNumber` hook.
	 *
	 * To have this logic fully handled for you, see the `Magic.PhoneAuth component.
	 */
	phoneNumber: string
	/**
	 * Callback function invoked whenever the user types a new phone number. Used with the `usePhoneNumber` hook.
	 *
	 * To have this logic fully handled for you, see the `Magic.PhoneAuth component.
	 *
	 * @param info
	 * @param info.phoneNumber string that is the current phone number
	 * @param info.valid boolean that tells you if the current phone number is valid or not. If yes, it's ready to send an SMS to.
	 *
	 * To have this logic handled for you, see the `Magic.PhoneAuth component.
	 */
	onChangePhoneNumber: (info: { phoneNumber: string; valid: boolean }) => void
	/**
	 * Callback function called when a user submits their phone number with the send button. Used with the `usePhoneNumber` hook.
	 *
	 * To have this logic fully handled for you, see the `Magic.PhoneAuth component.
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
	inputStyle?: ComponentPropsWithoutRef<typeof TextInput>['style']
	/**
	 * The color used for the screens color scheme. To get more specific style, check out the other style props. Changing this color will update the send button and text selection color.
	 */
	tintColor?: string
	/**
	 * Text to show inside the button. Defaults to send.
	 */
	buttonText?: string | 'Send' | 'Submit'
	/**
	 * Props passed onto the react-native-paper button component.
	 */
	buttonProps?: Omit<
		ComponentPropsWithoutRef<typeof Button>,
		'children' | 'style'
	>
	/**
	 * Custom styles for the send button.
	 */
	buttonStyle?: ComponentPropsWithoutRef<typeof Button>['style']
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
	 * 	 <PhoneAuth
	 *     disclaimer={({ buttonText }) => `When you press "${buttonText}", we'll send you a text. Message & data rates may apply. Reply chill to stop.`}
	 *   />
	 *  )
	 * }
	 * ```
	 */
	disclaimer?: string | ((info: { buttonText: string }) => string)
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
	 *
	 * export default () => {
	 * 	return (
	 * 	 <PhoneAuth
	 *     renderButton={({ valid, loading, submit, ...props }) => <Button {...props} {...yourOtherPropsHere} onPress={valid && !loading ? submit : undefined} />}
	 *     ...
	 *   />
	 *  )
	 * }
	 * ```
	 */
	renderButton?: (
		props: ComponentPropsWithoutRef<typeof Button> & {
			valid: boolean
			submit: () => void
		}
	) => ReactNode
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
		buttonProps = empty.object,
		buttonStyle = empty.object,
		title = 'Enter your phone number',
		message = `We'll send you a text with a code to confirm it's you.`,
		disclaimer = `By tapping "${buttonText}", an SMS may be sent. Message & data rates may apply.`,
		invalidNumberAlertText = 'Please enter a valid phone number.',
		renderButton,
	} = props
	const submit = useCallback(() => onSubmitPhone({ phoneNumber }), [
		phoneNumber,
		onSubmitPhone,
	])
	const button = () => {
		const renderProps: ComponentPropsWithoutRef<typeof Button> = {
			mode: 'contained',
			style: [styles.button, { backgroundColor: tintColor }, buttonStyle],
			onPress: () => {
				if (!valid) {
					Alert.alert(invalidNumberAlertText)
				} else if (!loading) {
					submit()
				}
			},
			// disabled={!valid}
			loading,
			...buttonProps,
			children: buttonText,
		}
		if (renderButton) return renderButton({ ...renderProps, valid, submit })
		return <Button {...renderProps} />
	}
	const renderDisclaimer = () => {
		if (typeof disclaimer === 'function') {
			return disclaimer({ buttonText })
		}
		return disclaimer
	}

	return (
		<ScrollView
			{...containerProps}
			style={[styles.container, containerStyle]}
			// centerContent
			keyboardDismissMode="on-drag"
			scrollEnabled={false}
			keyboardShouldPersistTaps="handled"
		>
			<View style={styles.wrapper}>
				<Text style={TextStyle.h1}>{title}</Text>
				<Text style={TextStyle.subtitle}>{message}</Text>
				<View>
					{/*<TextInput
						{...inputProps}
						placeholder="+1 555-654-4654"
						value={phoneNumber}
						onChangeText={text =>
							onChangePhoneNumber({ phoneNumber: text, valid })
						}
						disabled={loading}
						style={inputStyle}
						mode="outlined"
						label="Phone Number"
						underlineColor={tintColor}
						selectionColor={tintColor}
						onSubmitEditing={submit}
						autoFocus
						// textContentType=""
						keyboardType="phone-pad"
					/>*/}
					<PhoneInput
						value={phoneNumber}
						onChangePhoneNumber={onChangePhoneNumber}
						inputProps={{
							autoFocus: true,
							selectionColor: tintColor,
							placeholder: 'Phone number',
							...inputProps,
						}}
						textStyle={{ fontSize: 20, fontWeight: 'bold' }}
						style={{
							padding: 16,
							backgroundColor: '#e8e8e880',
							borderRadius: 4,
							...inputStyle,
						}}
					/>
				</View>
				<View style={styles.buttonWrapper}>{button()}</View>
				<Text style={TextStyle.disclaimer}>{renderDisclaimer()}</Text>
			</View>
		</ScrollView>
	)
}

const styles = ScreenStyle
