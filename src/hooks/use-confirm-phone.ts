import { useState, useEffect, useRef } from 'react'
import { doorman } from '../methods'
import { useNetworkReducer } from './use-network-reducer'

const CodeLength = 6

type Props = {
	/**
	 * Mandatory callback function, called when SMS has been successfully sent to end user.
	 *
	 * @param info dictionary returning a token
	 * @param info.token string with a token you can use with your custom firebase auth
	 * @param info.uid The user ID string returned from that person, if any.
	 */
	onCodeVerified(info: { token: string }): void
	phoneNumber: string
}

export default function useConfirmPhone({
	phoneNumber,
	onCodeVerified: onVerified,
}: Props) {
	const [code, setCode] = useState('')
	// const [uploading, setLoading] = useState(false)
	const {
		loading: uploading,
		error,
		setLoading,
		setError,
	} = useNetworkReducer()

	const onCodeVerified = useRef(onVerified)
	useEffect(() => {
		onCodeVerified.current = onVerified
	})

	useEffect(() => {
		const send = async () => {
			setLoading(true)
			try {
				const verify = await doorman.verifyCode({ code, phoneNumber })
				console.log('verifyyyying code', verify)
				const { token } = verify
				if (token) onCodeVerified.current({ token })
				setError(null)

				// setLoading(false)
			} catch (e) {
				console.error('verify token failed: ', e)
				setError(e)
				setLoading(false)
			}
		}

		if (code.length === CodeLength && !uploading) {
			send()
		} else {
			setLoading(false)
		}
	}, [code, phoneNumber, setLoading, setError, uploading])

	return {
		code,
		onChangeCode: setCode,
		loading: uploading,
		reset: () => setCode(''),
		error,
	}
}
