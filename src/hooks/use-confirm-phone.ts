import { useState, useEffect, useRef, useCallback } from 'react'
import { doorman } from '../methods'
import { useNetworkReducer } from './use-network-reducer'

const CodeLength = 6

type Props = {
	/**
	 * Mandatory callback function, called when SMS has been successfully sent to end user.
	 *
	 * @param info dictionary returning a token
	 * @param info.token string with a token you can use with your custom firebase auth
	 */
	onCodeVerified: (info: { token: string }) => void
	phoneNumber: string
}

type Errors = 'Error: custom/code-does-not-match'

export function useConfirmPhone({
	phoneNumber,
	onCodeVerified: onVerified,
}: Props) {
	const [code, setCode] = useState('')
	// const [uploading, setLoading] = useState(false)
	const { loading: uploading, error, setLoading, setError } = useNetworkReducer<
		Errors
	>()
	const [resending, setResending] = useState(false)

	const resend = useCallback(async () => {
		try {
			setResending(true)
			setError(null)
			const { error, success } = await doorman.signInWithPhoneNumber({
				phoneNumber,
			})
			if (error) throw new Error(error)
			setResending(false)
			if (!success) {
				console.warn(
					'SMS did not properly send a code from the resend() function in the useConfirmPhone() hook. If you are using test numbers, disregard this warning.'
				)
			}
			return { success: true, error: null }
		} catch (e) {
			setResending(false)
			setError(e.message)
			return { success: false, error: e.message as string }
		}
	}, [setError, phoneNumber])

	const onCodeVerified = useRef(onVerified)
	useEffect(() => {
		onCodeVerified.current = onVerified
	})

	useEffect(() => {
		const send = async () => {
			setLoading(true)
			try {
				const { token, error } = await doorman.verifyCode({ code, phoneNumber })
				if (token) {
					setError(null)
					return onCodeVerified.current({ token })
				}

				if (error) throw new Error(error)
			} catch (e) {
				setError(e.message)
				setLoading(false)
			}
		}

		if (code.length === CodeLength) {
			send()
		} else {
			setLoading(false)
			setError(null)
		}
	}, [code, phoneNumber, setLoading, setError])

	return {
		code,
		onChangeCode: setCode,
		loading: uploading,
		reset: () => setCode(''),
		error,
		resend,
		resending,
	}
}
