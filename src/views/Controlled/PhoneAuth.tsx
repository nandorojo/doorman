import React from 'react'
import { usePhoneNumber } from '../../hooks/usePhoneNumber-old'
import { PhoneAuth } from '../PhoneAuth'

type Props = {
	onSubmitPhone: React.ComponentPropsWithoutRef<
		typeof PhoneAuth
	>['onSubmitPhone']
}

export default function ControlledPhoneAuth({ onSubmitPhone }: Props) {
	const {
		phoneNumber,
		onChangePhoneNumber,
		valid,
		signInWithPhoneNumber,
	} = usePhoneNumber()

	return (
		<PhoneAuth
			onChangePhoneNumber={({ phoneNumber }) => {
				onChangePhoneNumber(phoneNumber)
			}}
			{...{ onSubmitPhone, phoneNumber, valid }}
		/>
	)
}
