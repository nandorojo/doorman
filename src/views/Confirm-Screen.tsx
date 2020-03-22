import React, { ReactNode, ComponentPropsWithoutRef, useCallback } from 'react'
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	TextStyle as TextStyleType,
	ViewStyle,
	TextInput,
} from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { ScreenStyle } from '../style/screen'
import { TextStyle } from '../style/text'
import { Page } from '../components/Page'
import { Paragraph, H1 } from '../components'
import { empty } from '../utils/empty'
import { CommonScreenProps } from './types'
import { ScreenBackground } from '../components/Background'
import { Header } from 'react-native-elements'

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
}

function Confirm(props: Props) {
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
		renderBackground,
		backgroundColor,
		renderHeader,
		renderHeaderTitle,
		headerText = 'Confirm',
		headerTintColor,
		headerTitleStyle,
		textAlign = 'center',
		headerProps,
		headerBackgroundColor = 'transparent',
		textColor = 'white',
		resendStyle,
		renderLoader,
		inputBackgroundColor = 'white',
		inputContainerStyle,
		inputTextColor = 'black',
		inputType,
		onGoBack,
		onPressResendCode,
		loaderColor,
	} = props

	const renderMessage = useCallback(() => {
		if (message) {
			return (
				<Paragraph style={[styles.subtitle, { color: textColor, textAlign }]}>
					{typeof message === 'function' ? message({ phoneNumber }) : message}
				</Paragraph>
			)
		}

		return (
			<Paragraph style={[styles.subtitle, { color: textColor, textAlign }]}>
				We just sent a 6-digit code to{' '}
				<Paragraph style={styles.number}>{phoneNumber}</Paragraph>. Enter it
				below to continue.
			</Paragraph>
		)
	}, [message, phoneNumber, textAlign, textColor])
	const renderInput = useCallback(() => {
		return (
			<View style={[styles.inputContainer, inputContainerStyle]}>
				<TextInput
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
					style={{
						borderRadius: 8,
						padding: 20,
						fontSize: 20,
						textAlign,
						fontWeight: 'bold',
						backgroundColor: inputBackgroundColor,
						color: inputTextColor,
					}}
				/>
			</View>
		)
	}, [
		code,
		inputBackgroundColor,
		inputContainerStyle,
		inputTextColor,
		loading,
		onChangeCode,
		textAlign,
	])

	const renderResend = useCallback(
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

	const loader = useCallback(
		() =>
			(!!loading && renderLoader?.()) || (
				<View style={{ marginVertical: 8 }}>
					<ActivityIndicator
						animating={loading}
						color={loaderColor ?? textColor}
					/>
				</View>
			),
		[loading, renderLoader, textColor, loaderColor]
	)

	const renderError = useCallback(() => {
		return (
			!!error && (
				<Text style={[styles.error, errorStyle]}>
					{error}. Please try resending the code.
				</Text>
			)
		)
	}, [error, errorStyle])

	const background = useCallback(() => {
		if (renderBackground === null) return null
		if (renderBackground) return renderBackground()

		return <ScreenBackground color={backgroundColor} />
	}, [renderBackground, backgroundColor])

	const header = useCallback(() => {
		if (renderHeader === null) return null
		if (renderHeader) return renderHeader({ screen: 'phone' })

		return (
			<Header
				containerStyle={{
					backgroundColor: headerBackgroundColor,
					justifyContent: textAlign === 'left' ? 'space-between' : 'center',
					borderBottomWidth: 0,
				}}
				{...headerProps}
				leftComponent={{
					icon: 'arrow-back',
					color: headerTintColor ?? textColor,
					onPress: onGoBack,
				}}
				centerComponent={
					renderHeaderTitle?.() ?? {
						text: headerText,
						style: {
							color: headerTintColor ?? textColor,
							...headerTitleStyle,
							fontWeight: '500',
							fontSize: 18,
						},
					}
				}
			/>
		)

		// return (
		// 	<Appbar.Header
		// 		{...headerProps}
		// 		style={{ backgroundColor: headerBackgroundColor, elevation: 0 }}
		// 	>
		// 		{(!!renderHeaderTitle && renderHeaderTitle()) || (
		// 			<View style={{ flex: 1, paddingHorizontal: 16 }}>
		// 				<Text
		// 					style={[
		// 						{
		// 							textAlign,
		// 							color: headerTintColor ?? textColor,
		// 							fontWeight: '500',
		// 							fontSize: 18,
		// 						},
		// 						headerTitleStyle,
		// 					]}
		// 				>
		// 					{headerText}
		// 				</Text>
		// 			</View>
		// 		)}
		// 	</Appbar.Header>
		// )
	}, [
		renderHeader,
		headerBackgroundColor,
		textAlign,
		headerProps,
		headerTintColor,
		textColor,
		onGoBack,
		renderHeaderTitle,
		headerText,
		headerTitleStyle,
	])
	const renderTitle = useCallback(() => {
		return <H1 style={{ textAlign, color: textColor }}>{title}</H1>
	}, [textAlign, textColor, title])

	return (
		<Page
			header={header}
			background={background}
			containerProps={containerProps}
			style={containerStyle}
		>
			<View style={styles.wrapper}>
				{renderTitle()}
				{renderMessage()}
				{renderInput()}
				{renderResend()}
				{loader()}
				{renderError()}
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
