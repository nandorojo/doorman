import React, { ComponentPropsWithoutRef } from 'react'
import { ConfirmPhone } from '../ConfirmPhone'
import useConfirmPhone from '../../hooks/use-confirm-phone'

type Props = Parameters<typeof useConfirmPhone>[0] &
	Omit<
		ComponentPropsWithoutRef<typeof ConfirmPhone>,
		'onChangeCode' | 'onPressResendCode' | 'loading' | 'code'
	> & {
		phoneNumber: string
		tintColor?: string
	}

export default function ControlledConfirmPhone(props: Props) {
	const { code, onChangeCode, reset, loading } = useConfirmPhone(props)

	return (
		<ConfirmPhone
			{...{ code, onChangeCode, loading }}
			tintColor={props.tintColor}
			phoneNumber={props.phoneNumber}
		/>
	)
}
