import React, { useCallback, ComponentPropsWithoutRef } from 'react'
import { View, StyleSheet, ViewStyle, ScrollView } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { empty } from '../utils/empty'

interface Props {
	phoneNumber: string
	onChangePhoneNumber: (info: { phoneNumber: string; valid: boolean }) => void
	onSubmitPhone: (info: { phoneNumber: string }) => void
	loading?: boolean
	inputProps?: Omit<ComponentPropsWithoutRef<typeof TextInput>, 'style'>
	valid?: boolean
	containerProps?: Omit<ScrollView, 'style'>
	containerStyle?: ViewStyle
	inputStyle?: ComponentPropsWithoutRef<typeof TextInput>['style']
	tintColor?: string
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
	} = props
	const submit = useCallback(() => onSubmitPhone({ phoneNumber }), [
		phoneNumber,
		onSubmitPhone,
	])

	return (
		<ScrollView
			{...containerProps}
			style={[styles.container, containerStyle]}
			centerContent
		>
			<View style={styles.wrapper}>
				<View>
					<TextInput
						{...inputProps}
						placeholder="Phone Number"
						value={phoneNumber}
						onChangeText={text =>
							onChangePhoneNumber({ phoneNumber: text, valid })
						}
						style={inputStyle}
					/>
				</View>
				<View style={styles.buttonWrapper}>
					<Button
						mode="contained"
						style={{ backgroundColor: tintColor }}
						onPress={submit}
						disabled={!valid}
					>
						Send
					</Button>
				</View>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		// padding: 16,
		flex: 1,
	},
	wrapper: {
		padding: 16,
	},
	buttonWrapper: {
		marginVertical: 16,
	},
})
