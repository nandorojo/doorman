import React, { useState } from 'react'
import firebase from 'firebase/app'
import ControlledPhoneAuth from './PhoneAuth'
import ControlledConfirmPhone from './ConfirmPhone'

export default function FirebasePhoneStack() {
	const [phoneNumber, setPhoneNumber] = useState('')

	if (!phoneNumber)
		return (
			<ControlledPhoneAuth
				onSubmitPhone={({ phoneNumber }) => setPhoneNumber(phoneNumber)}
			/>
		)

	return (
		<ControlledConfirmPhone
			phoneNumber={phoneNumber}
			onCodeVerified={({ token }) => {
				if (token) firebase.auth().signInWithCustomToken(token)
				else console.warn('oooo no token lol')
			}}
		/>
	)
}
