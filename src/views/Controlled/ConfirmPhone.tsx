import React from 'react'
import { ConfirmPhone } from '../ConfirmPhone'
import useConfirmPhone from '../../hooks/use-confirm-phone'

type Props = Parameters<typeof useConfirmPhone>[0] & {
	phoneNumber: string
}

export default function ControlledConfirmPhone({
	phoneNumber,
	...props
}: Props) {
	const confirmPhone = useConfirmPhone(props)

	return <ConfirmPhone {...confirmPhone} {...{ phoneNumber }} />
}
