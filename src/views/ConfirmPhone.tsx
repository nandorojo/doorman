import React, { ReactNode } from 'react'
import {
	View,
	StyleSheet,
	ScrollView,
	Text,
	TouchableOpacity,
	TextStyle as TextStyleType,
} from 'react-native'
import { TextInput, ActivityIndicator } from 'react-native-paper'
import { ScreenStyle } from '../style/screen'
import { TextStyle } from '../style/text'

interface Props {
	code: string
	/**
	 * Required prop: Function called every time the code is changed. It is recommended to use this with the `useConfirmPhone` hook.
	 *
	 * To have this logic fully handled for you, see the `Magic.ConfirmPhone` component. Or, for an even simpler experience, see the `Magic.PhoneStack` stack.
	 *
	 * @example
	 * ```jsx
	 * import * as React from 'react'
	 * import { useConfirmPhone, ConfirmPhone } from 'doorman'
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
	 * To have this logic fully handled for you, see the `Magic.ConfirmPhone` component. Or, for an even simpler experience, see the `Magic.PhoneStack` stack.
	 *
	 *  * @example
	 * ```jsx
	 * import * as React from 'react'
	 * import { useConfirmPhone, ConfirmPhone } from 'doorman'
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
	loading?: boolean
	/**
	 * **Required** `phoneNumber` that the 6-digit code was sent to. You should have this value from the previous screen, `PhoneAuth`. To have this logic between screens all handled for you, see the `Magic.PhoneStack` component.
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
	onReset?: () => void
	tintColor?: string
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
}

export function ConfirmPhone(props: Props) {
	const {
		code,
		onChangeCode,
		loading,
		phoneNumber,
		message,
		tintColor,
		title = 'Enter Code',
		error,
		errorStyle,
		resending,
		resendText = 'Resend Code',
	} = props

	const renderMessage = () => {
		if (message) {
			if (typeof message === 'function') {
				return <Text style={styles.subtitle}>{message({ phoneNumber })}</Text>
			}

			return <Text style={styles.subtitle}>{message}</Text>
		}

		return (
			<Text style={styles.subtitle}>
				We just sent a 6-digit code to{' '}
				<Text style={styles.number}>{phoneNumber}</Text>. Enter it below to
				continue.
			</Text>
		)
	}
	const renderInput = () => (
		<TextInput
			value={code}
			onChangeText={onChangeCode}
			editable={!loading}
			maxLength={6}
			mode="outlined"
			clearButtonMode="while-editing"
			label="6-digit code"
			textContentType="oneTimeCode"
			autoFocus
			keyboardType="number-pad"
			accessibilityHint="6-digit phone number texted to you"
			returnKeyType="done"
		/>
	)

	const renderResend = () =>
		!loading && props.onPressResendCode ? (
			<>
				<TouchableOpacity
					disabled={resending}
					onPress={() => props.onPressResendCode?.({ phoneNumber })}
				>
					<Text style={[{ color: tintColor }, styles.resend]}>
						{resending ? 'Resending code...' : resendText}
					</Text>
				</TouchableOpacity>
			</>
		) : null

	const renderLoader = () =>
		!!loading && (
			<View style={{ marginVertical: 8 }}>
				<ActivityIndicator animating={loading} color={tintColor} />
			</View>
		)

	const renderError = () => {
		return (
			!!error && (
				<Text style={[styles.error, errorStyle]}>
					{error}. Please try resending the code.
				</Text>
			)
		)
	}

	return (
		<ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
			<View style={styles.wrapper}>
				<Text style={TextStyle.h1}>{title}</Text>
				{renderMessage()}
				{renderInput()}
				{renderLoader()}
				{renderError()}
				{renderResend()}
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	message: {
		textAlign: 'center',
		marginVertical: 10,
		fontSize: 18,
	},
	number: {
		fontWeight: 'bold',
		textAlign: 'center',
	},
	resend: {
		marginTop: 16,
		textAlign: 'center',
	},
	...ScreenStyle,
	...TextStyle,
})
