import { useState, useEffect, useRef } from 'react'
import { verifyToken } from '../methods'

interface Config {
	// code?: string
	// onChange?: (code: string) => void
	onSubmit?: (code: string) => void
}

const CodeLength = 6

export default function useConfirmPhone() {
	const [code, setCode] = useState('')
	const [loading, setLoading] = useState(false)
	// const handlesCodeFromProps =
	// 	config.code !== undefined && config.onChange !== undefined

	// useEffect(() => {
	// 	if (
	// 		!handlesCodeFromProps &&
	// 		(config.code !== undefined || config.onChange !== undefined)
	// 	) {
	// 		console.warn(
	// 			'useConfirmPhone hook error: The code and onChange options must be used together. If you think this is a mistake, make sure you are initializing the code prop with an empty string. If you do not want to use them, make sure to not include either.'
	// 		)
	// 	}
	// })
	// const onSubmit = useRef(config.onSubmit)
	// useEffect(() => {
	// 	onSubmit.current = config.onSubmit
	// })

	// const [code, setCode] = handlesCodeFromProps
	// 	? [config.code, config.onChange]
	// 	: [codeState, setCodeState]

	useEffect(() => {
		const send = async () => {
			// if (onSubmit.current) onSubmit.current(code)
			setLoading(true)
			try {
				await verifyToken({ token: code })
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

	return { code, setCode, loading }
}
