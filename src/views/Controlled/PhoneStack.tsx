import React, { useState, ComponentPropsWithoutRef } from 'react'
import firebase from 'firebase/app'
import ControlledPhoneAuth from './PhoneAuth'
import ControlledConfirmPhone from './ConfirmPhone'
import { Appbar } from 'react-native-paper'
import { empty } from '../../utils/empty'

type Props = {
	onCodeVerified?: ComponentPropsWithoutRef<
		typeof ControlledConfirmPhone
	>['onCodeVerified']
	tintColor?: string
	phoneScreenProps?: Omit<
		ComponentPropsWithoutRef<typeof ControlledPhoneAuth>,
		'onSmsSuccessfullySent' | 'tintColor'
	>
	codeScreenProps?: Omit<
		ComponentPropsWithoutRef<typeof ControlledConfirmPhone>,
		'phoneNumber' | 'tintColor' | 'onCodeVerified'
	>
}

export default function FirebasePhoneStack(props: Props) {
	const [phoneNumber, setPhoneNumber] = useState('')

	const {
		phoneScreenProps = empty.object,
		codeScreenProps = empty.object,
	} = props

	if (!phoneNumber)
		return (
			<>
				<Appbar.Header style={{ backgroundColor: props?.tintColor }}>
					<Appbar.Content title="Sign in" />
				</Appbar.Header>
				<ControlledPhoneAuth
					{...phoneScreenProps}
					onSmsSuccessfullySent={({ phoneNumber }) => {
						console.log('seeeent', { phoneNumber })
						setPhoneNumber(phoneNumber)
					}}
					tintColor={props?.tintColor}
				/>
			</>
		)

	return (
		<>
			<Appbar.Header style={{ backgroundColor: props?.tintColor }}>
				<Appbar.BackAction onPress={() => setPhoneNumber('')} />
				<Appbar.Content title="Confirm number" />
			</Appbar.Header>
			<ControlledConfirmPhone
				{...codeScreenProps}
				phoneNumber={phoneNumber}
				tintColor={props?.tintColor}
				onCodeVerified={info => {
					if (props?.onCodeVerified) props?.onCodeVerified?.(info)
					else {
						const { token } = info
						if (token) firebase.auth().signInWithCustomToken(token)
						else console.warn('oooo no token lol')
					}
				}}
			/>
		</>
	)
}
