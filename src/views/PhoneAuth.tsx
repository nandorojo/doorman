import React from 'react'
import { View, TextInput, Button, StyleSheet } from 'react-native'
import { usePhoneNumber } from '../hooks/usePhoneNumber'

interface Props {
	phoneNumber?: string
	onChangePhoneNumber?: (phoneNumber: string) => void
	onSubmitPhone: (phoneNumber: string) => void
	loading?: boolean
}

export default function PhoneAuth(props: Props) {
	const { phoneNumber, setPhoneNumber, signInWithPhoneNumber } = usePhoneNumber(
		{
			phoneNumber: props.phoneNumber,
			onChangePhoneNumber: props.onChangePhoneNumber
		}
	)

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Phone Number"
				value={phoneNumber}
				onChangeText={setPhoneNumber}
			/>
			<Button
				onPress={() => {
					props.onSubmitPhone(phoneNumber)
				}}
				title="Submit"
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})
