import React, { ComponentPropsWithoutRef, useCallback } from 'react'
import { ConfirmScreen } from '../Confirm-Screen'
import { useConfirmPhone } from '../../hooks/use-confirm-phone'
import { Alert } from 'react-native'
import { useAuthFlowState } from '../../hooks/use-auth-flow-state'
import firebase from 'firebase/app'

type Props = Omit<
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
		onCodeVerified: async ({ token }) => {
			if (token) {
				// sign the user in
				await firebase.auth().signInWithCustomToken(token)
			}
		},
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