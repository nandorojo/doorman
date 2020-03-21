import React, { ComponentPropsWithoutRef } from 'react'
import { usePhoneNumber } from '../../hooks/use-phone-number'
import { PhoneAuth } from '../PhoneAuth'
import { Appbar } from 'react-native-paper'

type Props = Omit<
	ComponentPropsWithoutRef<typeof PhoneAuth>,
	'onChangePhoneNumber' | 'onSubmitPhone' | 'phoneNumber' | 'valid' | 'loading'
> & {
	onSmsSuccessfullySent(info: { phoneNumber: string }): void
	onSmsError?: (error: unknown) => void
	testNumbers?: string[]
	headerProps?: ComponentPropsWithoutRef<typeof Appbar.Header>
	/**
	 * The initial value of the hpone number input before typing.
	 * You may want to set this to the prefix for your country.
	 * Default: '+1' for US.
	 * Set to an empty string if you want none.
	 */
	initialPhoneNumber?: string
}

export default function ControlledPhoneAuth(props: Props) {
	const {
		onSmsSuccessfullySent,
		onSmsError,
		testNumbers,
		...otherProps
	} = props

	const {
		phoneNumber,
		onChangePhoneNumber,
		valid,
		submitPhone,
		loading,
	} = usePhoneNumber({
		onSmsSuccessfullySent,
		onSmsError,
		testNumbers,
	})

	return (
		<PhoneAuth
			{...otherProps}
			onChangePhoneNumber={onChangePhoneNumber}
			onSubmitPhone={submitPhone}
			phoneNumber={phoneNumber}
			valid={valid}
			loading={loading}
		/>
	)
}
