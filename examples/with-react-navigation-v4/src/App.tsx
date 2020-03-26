import * as React from 'react'
import { DoormanProvider, AuthGate } from 'react-native-doorman'
import { enableScreens } from 'react-native-screens'

import AfterAuth from './After-Auth'
import { Auth } from './Auth-Stack'

enableScreens()

// 1. initialize firebase 👇
import firebase from 'firebase/app'
import 'firebase/auth'
if (!firebase.apps.length) {
	firebase.initializeApp({
		apiKey: 'AIzaSyCn8HyP1tVZiagk-YvZRwjSwKdwQw5Pvng',
		authDomain: 'tester-9d8bb.firebaseapp.com',
		databaseURL: 'https://tester-9d8bb.firebaseio.com',
		projectId: 'tester-9d8bb',
		storageBucket: 'tester-9d8bb.appspot.com',
		messagingSenderId: '760778283392',
		appId: '1:760778283392:web:05cb35d0837c93c6584965',
	})
}

const App = () => {
	// 2. initialize Doorman 👇
	return (
		<DoormanProvider
			publicProjectId="djzlPQFxxzJikNQgLwxN"
			onAuthStateChanged={user => console.log('updated user', { user })} // <-- optional, delete if you want.
		>
			<AuthGate>
				{({ user, loading }) => {
					if (loading) return <></>

					// if a user is authenticated
					if (user) return <AfterAuth />

					// otherwise, send them to the auth flow
					return <Auth />
				}}
			</AuthGate>
		</DoormanProvider>
	)
}

export default App
