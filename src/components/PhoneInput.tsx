import React, { MutableRefObject, useRef, useEffect, useCallback } from 'react'
// @ts-ignore
import Input from 'react-native-phone-input'
import { TextStyle, StyleProp, TextInput } from 'react-native'
import { empty } from '../utils/empty'

type Ref = {
	isValidNumber(): boolean
	getValue(): boolean
	focus(): void
	blur(): void
}

type Props = {
	value: string
	onChangePhoneNumber: (info: { phoneNumber: string; valid: boolean }) => void
	textStyle?: StyleProp<TextStyle>
	inputRef?: MutableRefObject<Ref | null>
	inputProps?: TextInput['props']
	disabled?: boolean
	style?: TextInput['props']['style']
}

export function PhoneInput(props: Props) {
	const {
		inputRef,
		value,
		onChangePhoneNumber,
		inputProps = empty.object,
		textStyle,
		style,
	} = props

	const ref = useRef<Ref>(null)
	useEffect(() => {
		if (inputRef?.current) inputRef.current = ref.current
	})

	const onChangeText = useCallback(
		(phoneNumber: string) => {
			onChangePhoneNumber({
				phoneNumber,
				valid: !!ref.current?.isValidNumber(),
			})
		},
		[onChangePhoneNumber]
	)

	return (
		<Input
			textStyle={textStyle}
			style={style}
			ref={ref}
			onChangePhoneNumber={onChangeText}
			value={value}
			textProps={inputProps}
		/>
	)
}
