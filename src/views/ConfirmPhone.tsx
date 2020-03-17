import React, { ReactNode, ComponentPropsWithoutRef } from 'react'
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	TextStyle as TextStyleType,
	ViewStyle,
} from 'react-native'
import { TextInput, ActivityIndicator } from 'react-native-paper'
import { ScreenStyle } from '../style/screen'
import { TextStyle } from '../style/text'
import { Page } from '../components/Page'
import { Paragraph, H1 } from '../components'
import { empty } from '../utils/empty'

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
	 *import Container from '../../../react-native-bootstrap/src/components/Container/index'
import { H1 } from '../components/Text'

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
	/**
	 * Props for the scroll view containing the whole screen. For styles, see `containerStyle`
	 */
	containerProps?: Omit<ComponentPropsWithoutRef<typeof ScrollView>, 'style'>
	/**
	 * Style the outer screen.
	 */
	containerStyle?: ViewStyle
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
		containerProps = empty.object,
		containerStyle,
	} = props

	const renderMessage = () => {
		if (message) {
			return (
				<Paragraph style={styles.subtitle}>
					{typeof message === 'function' ? message({ phoneNumber }) : message}
				</Paragraph>
			)
		}

		return (
			<Paragraph style={styles.subtitle}>
				We just sent a 6-digit code to{' '}
				<Paragraph style={styles.number}>{phoneNumber}</Paragraph>. Enter it
				below to continue.
			</Paragraph>
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
					<Paragraph
						style={[{ color: tintColor }, styles.resend as TextStyleType]}
					>
						{resending ? 'Resending code...' : resendText}
					</Paragraph>
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
		<Page containerProps={containerProps} style={containerStyle}>
			<View style={styles.wrapper}>
				<H1>{title}</H1>
				{renderMessage()}
				{renderInput()}
				{renderLoader()}
				{renderError()}
				{renderResend()}
			</View>
		</Page>
	)
}

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
