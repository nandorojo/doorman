import { useState } from 'react'
// import { useControlledOrInternalState } from './use-controlled-state'

// interface Props {
// 	phoneNumber?: string
// 	onChangePhoneNumber?: (phoneNumber: string) => void
// }

export function usePhoneNumber() {
	// const [phoneNumber, setPhoneNumber] = useControlledOrInternalState(
	// 	{
	// 		state: props?.phoneNumber,
	// 		setState: props?.onChangePhoneNumber,
	// 	},
	// 	''
	// )
	const [phoneNumber, setPhoneNumber] = useState('')
	// const signInWithPhoneNumber = useCallback(() => {
	// 	return signInWithPhoneNumber({ phoneNumber })
	// }, [phoneNumber])

	return {
		phoneNumber,
		onChangePhoneNumber: setPhoneNumber,
		// signInWithPhoneNumber,
		valid: phoneNumber.length > 9,
	}
}
