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
	onCodeVerified(info: { token: string }): void
}

export default function useConfirmPhone(props: Props) {
	const [code, setCode] = useState('')
	const [uploading, setLoading] = useState(false)

	const onCodeVerified = useRef(props.onCodeVerified)
	useEffect(() => {
		onCodeVerified.current = props.onCodeVerified
	})

	useEffect(() => {
		const send = async () => {
			setLoading(true)
			try {
				const { token } = await verifyCode({ code })
				if (token) onCodeVerified.current({ token })

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
	}, [code])

	return { code, onChangeCode: setCode, uploading, reset: () => setCode('') }
}
