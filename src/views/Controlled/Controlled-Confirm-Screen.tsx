import React, { ComponentPropsWithoutRef, useCallback } from 'react'
import { ConfirmScreen } from '../Confirm-Screen'
import useConfirmPhone from '../../hooks/use-confirm-phone'
import { Alert } from 'react-native'
import { useAuthFlowState } from '../../hooks/use-auth-flow-state'

type Props = Omit<Parameters<typeof useConfirmPhone>[0], 'phoneNumber'> &
	Omit<
		ComponentPropsWithoutRef<typeof ConfirmScreen>,
		| 'onChangeCode'
		| 'onPressResendCode'
		| 'loading'
		| 'code'
		| 'phoneNumber'
		| 'error'
		| 'resend'
		| 'resending'
	>

export default function ControlledConfirmScreen(props: Props) {
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
	const onPressResendCode = useCallback(
		() => async () => {
			const { success } = await resend()
			if (success) {
				Alert.alert('✅', `6-digit code was resent to ${phoneNumber}.`)
			}
		},
		[phoneNumber, resend]
	)

	return (
		<ConfirmScreen
			{...{ code, onChangeCode, loading, error, resending }}
			phoneNumber={phoneNumber}
			onPressResendCode={onPressResendCode}
			{...props}
		/>
	)
}
