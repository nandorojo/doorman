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
				onCodeVerified={async info => {
					if (props?.onCodeVerified) props?.onCodeVerified?.(info)
					else {
						const { token } = info
						if (token) {
							// sign the user in
							const { user } = await firebase
								.auth()
								.signInWithCustomToken(token)
							console.log('oooooo', { user })

							// if the user doesn't exist in the DB yet, add the user to the DB
							// if (user && !(await doorman.doesUserExist({ uid: user.uid }))) {
							// 	// you might also use this logic to navigate to a new user onboarding screen
							// 	doorman.addUserToDb(user)
							// }
						} else {
							console.warn('oooo no token lol')
						}
					}
				}}
			/>
		</>
	)
}
