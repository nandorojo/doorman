import {
	useCallback,
	useState,
	useEffect,
	ComponentPropsWithoutRef,
} from 'react'
import { doorman } from '../methods'
import { useControlledOrInternalState } from './use-controlled-state'
import { PhoneAuth } from '../views/PhoneAuth'

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
	/**
	 * If you are using test numbers, enter them exactly here.
	 * If they are not put here, the hook will never mark these numbers (starting with 555) as valid.
	 *
	 * This probably shouldn't have more than a few numbers. Definitely don't make it a really long list.
	 *
	 * Example: ['+15555555555']
	 */
	testNumbers?: string[]
}

type onChangePhoneNumber = ComponentPropsWithoutRef<
	typeof PhoneAuth
>['onChangePhoneNumber']

export function usePhoneNumber(props: Props) {
	const [phoneNumber, setPhoneNumber] = useControlledOrInternalState(
		{
			state: props.phoneNumber,
			setState: state => props.onChangePhoneNumber?.(state as string),
		},
		'+1'
	)
	const [valid, setValid] = useState()
	const [loading, setLoading] = useState(false)
	const { onSmsSuccessfullySent, onSmsError, testNumbers } = props

	const onChangePhoneNumber: onChangePhoneNumber = useCallback(
		({ phoneNumber, valid }) => {
			setLoading(false)
			let isValid = valid
			// if it's one of the test numbers, mark it as valid
			if (testNumbers && testNumbers.length > 10) {
				console.warn(
					'usePhoneNumber issue in onChangePhoneNumber. You passed a testNumbers argument with more than ten test numbers. This can slow down the TextInput. Make sure to reduce this number in production.'
				)
			}
			testNumbers?.forEach(number => {
				if (phoneNumber === number) isValid = true
			})
			setValid(isValid)
			setPhoneNumber(phoneNumber)
		},
		[testNumbers, setPhoneNumber]
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
		valid,
		loading,
	}
}
