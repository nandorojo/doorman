import * as React from 'react'
import AuthStack from './Stack' // <-- made in step #2 😇
import { DoormanProvider, AuthGate } from 'react-native-doorman'
import { createAppContainer } from 'react-navigation'
import { Text } from 'react-native'

// initialize firebase
import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
	apiKey: 'AIzaSyCn8HyP1tVZiagk-YvZRwjSwKdwQw5Pvng',
	authDomain: 'tester-9d8bb.firebaseapp.com',
	databaseURL: 'https://tester-9d8bb.firebaseio.com',
	projectId: 'tester-9d8bb',
	storageBucket: 'tester-9d8bb.appspot.com',
	messagingSenderId: '760778283392',
	appId: '1:760778283392:web:05cb35d0837c93c6584965',
}
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig)

// create react navigation container
const Navigator = createAppContainer(AuthStack)

// create our App component, shown once we've authed
const AuthedApp = () => (
	<Text
		onPress={() => firebase.auth().signOut()}
		style={{ paddingTop: 300, color: 'blue', fontSize: 24 }}
	>
		This app is authed!!
	</Text>
)

const App = () => {
	return (
		<DoormanProvider publicProjectId="djzlPQFxxzJikNQgLwxN">
			<AuthGate>
				{({ user, loading }) => {
					if (loading) return <></>

					// if a user is authenticated
					if (user) return <AuthedApp />

					// otherwise, send them to the auth flow
					return <Navigator />
				}}
			</AuthGate>
		</DoormanProvider>
	)
}

export default App
