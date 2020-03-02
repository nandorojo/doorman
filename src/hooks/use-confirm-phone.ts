import { useState, useEffect, useRef } from 'react'
import { verifyCode } from '../methods'

const CodeLength = 6

type Props = {
	/**
	 * Mandatory callback function, called when SMS has been successfully sent to end user.
	 *
	 * @param info dictionary returning a token
	 * @param info.token string with a token you can use with your custom firebase auth
	 */
	onCodeVerified(info: { token: string; uid: string }): void
	phoneNumber: string
}

export default function useConfirmPhone({
	phoneNumber,
	onCodeVerified: codeVerified,
}: Props) {
	const [code, setCode] = useState('')
	const [uploading, setLoading] = useState(false)

	const onCodeVerified = useRef(codeVerified)
	useEffect(() => {
		onCodeVerified.current = codeVerified
	})

	useEffect(() => {
		const send = async () => {
			setLoading(true)
			try {
				const { token, uid } = await verifyCode({ code, phoneNumber })
				if (token) onCodeVerified.current({ token, uid })

				setLoading(false)
			} catch (e) {
				console.error('verify token failed: ', e)
				setLoading(false)
			}
		}

		if (code.length === CodeLength) {
			send()
		} else {
			setLoading(false)
		}
	}, [code, phoneNumber])

	return { code, onChangeCode: setCode, uploading, reset: () => setCode('') }
}
