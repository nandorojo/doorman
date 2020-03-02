import React, {
	useCallback,
	ComponentPropsWithoutRef,
	RefObject,
	MutableRefObject,
	ComponentPropsWithRef,
} from 'react'
import { View, ViewStyle, ScrollView, Text } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { empty } from '../utils/empty'
import { TextStyle } from '../style/text'
import { ScreenStyle } from '../style/screen'

interface Props {
	phoneNumber: string
	onChangePhoneNumber: (info: { phoneNumber: string; valid: boolean }) => void
	onSubmitPhone: (info: { phoneNumber: string }) => void
	/**
	 * Boolean to indicate if the text is sending / loading. Button shows loading indicator during this time.
	 */
	loading?: boolean
	inputProps?: Omit<ComponentPropsWithoutRef<typeof TextInput>, 'style'>
	valid?: boolean
	containerProps?: Omit<ComponentPropsWithoutRef<typeof ScrollView>, 'style'>
	containerStyle?: ViewStyle
	inputStyle?: ComponentPropsWithoutRef<typeof TextInput>['style']
	tintColor?: string
	/**
	 * Text to show inside the button. Defaults to send.
	 */
	buttonText?: string | 'Send' | 'Submit'
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
	} = props
	const submit = useCallback(() => onSubmitPhone({ phoneNumber }), [
		phoneNumber,
		onSubmitPhone,
	])

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
				<Text style={TextStyle.h1}>Enter your phone number</Text>
				<Text style={TextStyle.subtitle}>
					{`We'll send you a text with a code to confirm it's you.`}
				</Text>
				<View>
					<TextInput
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
					/>
				</View>
				<View style={styles.buttonWrapper}>
					<Button
						mode="contained"
						style={{ backgroundColor: tintColor }}
						onPress={valid && !loading ? submit : undefined}
						// disabled={!valid}
						loading={loading}
					>
						{buttonText}
					</Button>
				</View>
			</View>
		</ScrollView>
	)
}

const styles = ScreenStyle
