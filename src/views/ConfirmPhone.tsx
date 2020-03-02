import React from 'react'
import {
	View,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
} from 'react-native'
import { TextInput } from 'react-native-paper'

interface Props {
	code: string
	onChangeCode: (code: string) => void
	loading?: boolean
	phoneNumber: string
	message?: string
	onPressResendCode?: (phoneNumber: string) => void
}

export function ConfirmPhone(props: Props) {
	const { code, onChangeCode, loading, phoneNumber, message } = props

	const renderMessage = () => (
		<View>
			{!!message ? (
				<Text style={styles.message}>{message}</Text>
			) : (
				<Text style={styles.message}>
					Enter the code we just sent to{' '}
					<Text style={styles.number}>{phoneNumber}</Text>.
				</Text>
			)}
		</View>
	)
	const renderInput = () => (
		<TextInput
			value={code}
			onChangeText={onChangeCode}
			editable={!loading}
			maxLength={6}
			style={styles.input}
		/>
	)

	const renderResend = () =>
		!loading && props.onPressResendCode ? (
			<>
				<TouchableOpacity
					onPress={() => props.onPressResendCode?.(props.phoneNumber)}
				>
					<Text style={[styles.message, styles.number]}>Resend Code</Text>
				</TouchableOpacity>
			</>
		) : null

	const renderLoader = () =>
		!!loading && (
			<View>
				<ActivityIndicator animating={loading} />
			</View>
		)

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			style={styles.container}
			centerContent
		>
			<View style={styles.wrapper}>
				{renderMessage()}
				{renderInput()}
				{renderLoader()}
				{renderResend()}
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	wrapper: {
		margin: 16,
	},
	message: {
		textAlign: 'center',
		marginVertical: 10,
		fontSize: 18,
	},
	input: {
		marginVertical: 16,
	},
	number: {
		fontWeight: 'bold',
		textAlign: 'center',
	},
})
