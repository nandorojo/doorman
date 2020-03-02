import React, { ComponentPropsWithoutRef } from 'react'
import { usePhoneNumber } from '../../hooks/use-phone-number'
import { PhoneAuth } from '../PhoneAuth'

type Props = Omit<
	ComponentPropsWithoutRef<typeof PhoneAuth>,
	'onChangePhoneNumber' | 'onSubmitPhone' | 'phoneNumber' | 'valid' | 'loading'
> & {
	onSmsSuccessfullySent(info: { phoneNumber: string }): void
	onSmsError?: (error: unknown) => void
}

export default function ControlledPhoneAuth(props: Props) {
	const { onSmsSuccessfullySent, onSmsError, ...otherProps } = props

	const {
		phoneNumber,
		onChangePhoneNumber,
		valid,
		submitPhone,
		loading,
	} = usePhoneNumber({
		onSmsSuccessfullySent,
	})

	return (
		<PhoneAuth
			{...otherProps}
			{...{ phoneNumber, valid, loading }}
			onChangePhoneNumber={onChangePhoneNumber}
			onSubmitPhone={submitPhone}
			// onSubmitPhone={async ({ phoneNumber }) => {
			// 	setLoading(true)
			// 	const response = await doorman.signInWithPhoneNumber({ phoneNumber })
			// 	setLoading(false)

			// 	if (response.success) {
			// 		onSmsSuccessfullySent({ phoneNumber })
			// 	} else {
			// 		console.warn(
			// 			'Error signing in with phone number. See doorman Magic.PhoneAuth component',
			// 			response
			// 		)
			// 		onSmsError?.(response.error)
			// 	}
			// }}
		/>
	)
}
