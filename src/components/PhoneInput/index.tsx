/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useCallback } from 'react'
// @ts-ignore
import Input from '@nandorojo/react-native-phone-input'
import { empty } from '../../utils/empty'
import { PhoneInputProps } from './types'

type Props = PhoneInputProps

export function PhoneInput(props: Props) {
	const {
		inputRef,
		value,
		onChangePhoneNumber,
		inputProps = empty.object,
		textStyle,
		style,
		phoneInputProps = empty.object,
	} = props

	const onChangeText = useCallback(
		(phoneNumber: string) => {
			onChangePhoneNumber({
				phoneNumber,
			})
		},
		[onChangePhoneNumber]
	)

	return (
		// @ts-ignore
		<Input
			textStyle={textStyle}
			style={style}
			ref={inputRef}
			onChangePhoneNumber={onChangeText}
			value={value}
			textProps={inputProps}
			{...phoneInputProps}
		/>
	)
}
