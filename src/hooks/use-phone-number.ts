import {
	useCallback,
	useState,
	useEffect,
	ComponentPropsWithoutRef,
} from 'react'
import { doorman } from '../methods'
import { PhoneAuth } from '../views/Phone-Screen'
import { useAuthFlowState } from './use-auth-flow-state'

interface Props {
	phoneNumber?: string
	onChangePhoneNumber?: (phoneNumber: string) => void
	/**
	 * Callback function called after an SMS is successfully sent to a given number. Usually, you'll use this function to navigate to the next screen (confirming a code.)
	 *
	 * @param info Dictionary containing the phone number a text was sent to
	 * @param info.phoneNumber The phone number a text was sent to.
	 */
	onSmsSuccessfullySent(info: { phoneNumber: string }): void
	onSmsError?(e: unknown): void
}

type onChangePhoneNumber = ComponentPropsWithoutRef<
	typeof PhoneAuth
>['onChangePhoneNumber']

export function usePhoneNumber(props: Props) {
	const {
		phoneNumber,
		onChangePhoneNumber: setPhoneNumber,
		isValidPhoneNumber,
	} = useAuthFlowState()
	// const [valid, setValid] = useState(false)
	const [loading, setLoading] = useState(false)
	const { onSmsSuccessfullySent, onSmsError } = props

	const onChangePhoneNumber: onChangePhoneNumber = useCallback(
		({ phoneNumber = '' }) => {
			setLoading(false)
			setPhoneNumber(phoneNumber)
		},
		[setPhoneNumber]
	)

	const submitPhone = useCallback(async () => {
		try {
			setLoading(true)

			const { success, error } = await doorman.signInWithPhoneNumber({
				phoneNumber,
			})
			if (!success) throw new Error(error)

			setLoading(false)
			onSmsSuccessfullySent({ phoneNumber })
		} catch (e) {
			console.error('usePhoneNumber failed', e)
			setLoading(false)
			onSmsError?.(e)
		}
	}, [onSmsError, onSmsSuccessfullySent, phoneNumber])

	useEffect(() => {
		setLoading(false)
	}, [phoneNumber])

	return {
		phoneNumber,
		onChangePhoneNumber,
		submitPhone,
		valid: isValidPhoneNumber,
		loading,
	}
}
