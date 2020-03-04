import React, { ComponentPropsWithoutRef } from 'react'
import { ConfirmPhone } from '../ConfirmPhone'
import useConfirmPhone from '../../hooks/use-confirm-phone'
import { doorman } from '../../methods'

type Props = Parameters<typeof useConfirmPhone>[0] &
	Omit<
		ComponentPropsWithoutRef<typeof ConfirmPhone>,
		'onChangeCode' | 'onPressResendCode' | 'loading' | 'code'
	> & {
		phoneNumber: string
		tintColor?: string
	}

export default function ControlledConfirmPhone(props: Props) {
	const { code, onChangeCode, loading } = useConfirmPhone({
		onCodeVerified: props.onCodeVerified,
		phoneNumber: props.phoneNumber,
	})

	return (
		<ConfirmPhone
			{...{ code, onChangeCode, loading }}
			tintColor={props.tintColor}
			phoneNumber={props.phoneNumber}
			onPressResendCode={doorman.signInWithPhoneNumber}
		/>
	)
}
