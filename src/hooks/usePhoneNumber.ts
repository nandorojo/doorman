import { useState, useEffect, useCallback } from 'react'
import { signInWithPhoneNumber } from '../methods'

interface Config {
	phoneNumber?: string
	onChangePhoneNumber?: (phoneNumber: string) => void
}

export function usePhoneNumber() {
	const [phoneNumber, setPhoneNumber] = useState('')
	// const handlesPhoneNumberFromProps =
	// 	config.phoneNumber !== undefined && config.onChangePhoneNumber !== undefined

	// useEffect(() => {
	// 	if (
	// 		!handlesPhoneNumberFromProps &&
	// 		(config.phoneNumber !== undefined ||
	// 			config.onChangePhoneNumber !== undefined)
	// 	) {
	// 		console.warn(
	// 			'PhoneAuth component error: The phoneNumber and onChangePhoneNumber props must be used together. If you think this is a mistake, make sure you are initializing the phoneNumber prop with an empty string.'
	// 		)
	// 	}
	// })

	// const [phoneNumber, setPhoneNumber] = handlesPhoneNumberFromProps
	// 	? [config.phoneNumber, config.onChangePhoneNumber]
	// 	: [phoneNumberState, setPhoneNumberState]

	const signInWithPhoneNumber = useCallback(() => {
		return signInWithPhoneNumber({ phoneNumber })
	}, [phoneNumber])

	return { phoneNumber, setPhoneNumber, signInWithPhoneNumber }
}
