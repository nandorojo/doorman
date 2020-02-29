import React, { useCallback, ComponentPropsWithoutRef } from 'react'
import {
	View,
	TextInput,
	Button,
	StyleSheet,
	ViewProps,
	ViewStyle,
} from 'react-native'
import { empty } from '../utils/empty'

interface Props {
	phoneNumber: string
	onChangePhoneNumber: (info: { phoneNumber: string; valid: boolean }) => void
	onSubmitPhone: (info: { phoneNumber: string }) => void
	loading?: boolean
	inputProps?: Omit<ComponentPropsWithoutRef<typeof TextInput>, 'style'>
	valid?: boolean
	containerProps?: Omit<ViewProps, 'style'>
	containerStyle?: ViewStyle
	inputStyle?: ComponentPropsWithoutRef<typeof TextInput>['style']
	tintColor?: string
}

export const PhoneAuth = React.forwardRef<TextInput, Props>(function PhoneAuth(
	props,
	ref
) {
	const {
		phoneNumber,
		onChangePhoneNumber,
		onSubmitPhone,
		valid,
		inputProps = empty.object,
		containerProps = empty.object,
		containerStyle,
		inputStyle,
		tintColor = '#533592',
	} = props
	const submit = useCallback(() => onSubmitPhone({ phoneNumber }), [
		phoneNumber,
		onSubmitPhone,
	])

	return (
		<View {...containerProps} style={[styles.container, containerStyle]}>
			<View>
				<TextInput
					{...inputProps}
					placeholder="Phone Number"
					value={phoneNumber}
					onChangeText={text =>
						onChangePhoneNumber({ phoneNumber: text, valid })
					}
					style={[styles.input, inputStyle]}
					ref={ref}
				/>
			</View>
			<View style={styles.buttonWrapper}>
				<Button onPress={submit} title="Submit" disabled={!valid} />
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	buttonWrapper: {
		alignItems: 'center',
	},
	input: {
		padding: 16,
		borderRadius: 4,
	},
})
