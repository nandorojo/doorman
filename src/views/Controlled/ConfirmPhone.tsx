import React, { ComponentPropsWithoutRef } from 'react'
import { ConfirmPhone } from '../ConfirmPhone'
import useConfirmPhone from '../../hooks/use-confirm-phone'
import { Alert } from 'react-native'
import { useDoormanTheme } from '../../hooks/use-doorman-theme'
import { useAuthFlowState } from '../../hooks/use-auth-flow-state'

type Props = Omit<Parameters<typeof useConfirmPhone>[0], 'phoneNumber'> &
	Omit<
		ComponentPropsWithoutRef<typeof ConfirmPhone>,
		'onChangeCode' | 'onPressResendCode' | 'loading' | 'code' | 'phoneNumber'
	> & {
		tintColor?: string
	}

export default function ControlledConfirmPhone(props: Props) {
	const { phoneNumber } = useAuthFlowState()
	const {
		code,
		onChangeCode,
		loading,
		error,
		resend,
		resending,
	} = useConfirmPhone({
		onCodeVerified: props.onCodeVerified,
		phoneNumber,
	})
	const { tintColor } = useDoormanTheme()

	return (
		<ConfirmPhone
			{...{ code, onChangeCode, loading, error, resending }}
			tintColor={props.tintColor ?? tintColor}
			phoneNumber={phoneNumber}
			onPressResendCode={async () => {
				const { success } = await resend()
				if (success) {
					Alert.alert('✅', `6-digit code was resent to ${phoneNumber}.`)
				}
			}}
			{...props}
		/>
	)
}
