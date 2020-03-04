import React, { ComponentPropsWithoutRef } from 'react'
import { usePhoneNumber } from '../../hooks/use-phone-number'
import { PhoneAuth } from '../PhoneAuth'

type Props = Omit<
	ComponentPropsWithoutRef<typeof PhoneAuth>,
	'onChangePhoneNumber' | 'onSubmitPhone' | 'phoneNumber' | 'valid' | 'loading'
> & {
	onSmsSuccessfullySent(info: { phoneNumber: string }): void
	onSmsError?: (error: unknown) => void
	testNumbers?: string[]
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
