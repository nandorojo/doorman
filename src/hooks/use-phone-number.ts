import {
	useCallback,
	useState,
	useEffect,
	ComponentPropsWithoutRef,
} from 'react'
import { signInWithPhoneNumber } from '../methods'
import { useControlledOrInternalState } from './use-controlled-state'
import { PhoneAuth } from '../views/PhoneAuth'

interface Props {
	phoneNumber?: string
	onChangePhoneNumber?: (phoneNumber: string) => void
	onCodeSentSuccessfully(info: { phoneNumber: string }): void
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
		setPhoneNumber(info.phoneNumber)
	}

	const { onCodeSentSuccessfully } = props

	const signIn = useCallback(async () => {
		try {
			setLoading(true)

			const { success, error } = await signInWithPhoneNumber({ phoneNumber })
			if (!success) throw new Error(error)

			onCodeSentSuccessfully({ phoneNumber })
			setLoading(false)
		} catch (e) {
			console.error('usePhoneNumber failed', e)
			setLoading(false)
		}
	}, [onCodeSentSuccessfully, phoneNumber])

	useEffect(() => {
		setLoading(false)
	}, [phoneNumber])

	return {
		phoneNumber,
		onChangePhoneNumber,
		signIn,
		valid: phoneNumber.length > 9,
		loading,
	}
}
