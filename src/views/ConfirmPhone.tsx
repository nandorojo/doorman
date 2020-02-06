import React from 'react'
import {
	View,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity
} from 'react-native'
import useConfirmPhone from '../hooks/useConfirmPhone'

interface Props {
	code?: string
	onChangeCode?: (code: string) => void
	onSubmitCode?: (code: string) => void
	loading?: boolean
	phoneNumber: string
	message?: string
	onPressResendCode: (phoneNumber: string) => void
}

export default function ConfirmPhone(props: Props) {
	const { code, setCode } = useConfirmPhone({
		code: props.code,
		onChange: props.onChangeCode,
		onSubmit: props.onSubmitCode
	})

	const renderMessage = () => (
		<View>
			{!!props.message ? (
				<Text style={styles.message}>{props.message}</Text>
			) : (
				<Text style={styles.message}>
					Enter the code we just sent to{' '}
					<Text style={styles.number}>{props.phoneNumber}</Text>.
				</Text>
			)}
		</View>
	)
	const renderInput = () => (
		<TextInput
			value={code}
			onChangeText={setCode}
			editable={!props.loading}
			maxLength={6}
			style={styles.input}
		/>
	)

	const renderResend = () =>
		!props.loading ? (
			<TouchableOpacity
				onPress={() => props.onPressResendCode(props.phoneNumber)}
			>
				<Text style={[styles.message, styles.number]}>Resend Code</Text>
			</TouchableOpacity>
		) : null

	const renderLoader = () => (
		<View>
			<ActivityIndicator animating={props.loading} />
		</View>
	)

	return (
		<ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
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
		flex: 1
	},
	wrapper: {
		marginTop: 20
	},
	message: {
		textAlign: 'center',
		margin: 10,
		fontSize: 18
	},
	input: {
		textAlign: 'center',
		fontSize: 20,
		letterSpacing: 5,
		padding: 10
	},
	number: {
		color: 'blue'
	}
})
