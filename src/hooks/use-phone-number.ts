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
	onSmsSuccessfullySent(info: { phoneNumber: string }): void
	onSmsError?(e: unknown): void
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
		''
	)
	const [loading, setLoading] = useState(false)

	const onChangePhoneNumber: onChangePhoneNumber = info => {
		setLoading(false)
		setPhoneNumber(info.phoneNumber)
	}

	const { onSmsSuccessfullySent, onSmsError } = props

	const submitPhone = useCallback(async () => {
		try {
			setLoading(true)

			const { success, error } = await doorman.signInWithPhoneNumber({
				phoneNumber,
			})
			if (!success) throw new Error(error)

			onSmsSuccessfullySent({ phoneNumber })
			setLoading(false)
		} catch (e) {
			console.error('usePhoneNumber failed', e)
			onSmsError?.(e)
			setLoading(false)
		}
	}, [onSmsError, onSmsSuccessfullySent, phoneNumber])

	useEffect(() => {
		setLoading(false)
	}, [phoneNumber])

	return {
		phoneNumber,
		onChangePhoneNumber,
		submitPhone,
		valid: phoneNumber.length > 9,
		loading,
	}
}
