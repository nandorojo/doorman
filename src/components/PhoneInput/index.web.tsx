import React, { useRef, useEffect, useCallback, CSSProperties } from 'react'
import { PhoneInputProps, PhoneInputRef } from './types'
import PhoneInputForm, { isPossiblePhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import { empty } from '../../utils/empty'

import './style.css'
import 'react-phone-number-input/style.css'

type Props = PhoneInputProps

export function PhoneInput(props: Props) {
	const {
		onChangePhoneNumber,
		value,
		disabled,
		textStyle = empty.object,
		style = empty.object,
		inputProps,
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
		<PhoneInputForm
			{...inputProps}
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			style={
				{
					...(style as CSSProperties),
					...(textStyle as CSSProperties),
				} as CSSProperties
			}
			value={value}
			onChange={onChangeText}
			flags={flags}
			disabled={disabled}
			defaultCountry="US"
			international
			autoFocus
			// color="white"
		/>
	)
}
