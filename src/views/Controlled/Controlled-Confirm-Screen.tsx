import React, { ComponentPropsWithoutRef, useCallback } from 'react'
import { ConfirmScreen } from '../Confirm-Screen'
import { useConfirmPhone } from '../../hooks/use-confirm-phone'
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
> & {
	/**
	 * Optional callback function called whenever a user successfully confirms their phone number.
	 *
	 * You might want to use this to add to your analytics, for instance.
	 *
	 * @example
	 * ```es6
	 * <AuthFlow.PhoneScreen onCodeVerified={() => analytics.track('Code Success')} />
	 * ```
	 */
	onCodeVerified?: (info: { token: string }) => void
}

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
				props.onCodeVerified?.({ token })
				await firebase.auth().signInWithCustomToken(token)
			}
		},
		phoneNumber,
	})
	const onPressResendCode = useCallback(async () => {
		const { success } = await resend()
		if (success) {
			alert(`✅ 6-digit code was resent to ${phoneNumber}.`)
		}
	}, [phoneNumber, resend])

	return (
		<ConfirmScreen
			{...{ code, onChangeCode, loading, error, resending }}
			phoneNumber={phoneNumber}
			onPressResendCode={onPressResendCode}
			{...props}
		/>
	)
}
