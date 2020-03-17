import React, { ComponentPropsWithoutRef } from 'react'
import { ConfirmPhone } from '../ConfirmPhone'
import useConfirmPhone from '../../hooks/use-confirm-phone'
import { Alert } from 'react-native'
import { useDoormanTheme } from '../../hooks/use-doorman-theme'

type Props = Parameters<typeof useConfirmPhone>[0] &
	Omit<
		ComponentPropsWithoutRef<typeof ConfirmPhone>,
		'onChangeCode' | 'onPressResendCode' | 'loading' | 'code'
	> & {
		phoneNumber: string
		tintColor?: string
	}

export default function ControlledConfirmPhone(props: Props) {
	const {
		code,
		onChangeCode,
		loading,
		error,
		resend,
		resending,
	} = useConfirmPhone({
		onCodeVerified: props.onCodeVerified,
		phoneNumber: props.phoneNumber,
	})
	const { tintColor } = useDoormanTheme()

	return (
		<ConfirmPhone
			{...{ code, onChangeCode, loading, error, resending }}
			tintColor={props.tintColor ?? tintColor}
			phoneNumber={props.phoneNumber}
			onPressResendCode={async () => {
				const { success } = await resend()
				if (success) {
					Alert.alert('✅', `6-digit code was resent to ${props.phoneNumber}.`)
				}
			}}
		/>
	)
}
