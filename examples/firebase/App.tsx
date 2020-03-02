import React from 'react'
import { AuthGate, DoormanProvider, withPhoneAuth } from 'expo-phone-auth'
import { StyleSheet, Text, View } from 'react-native'
import firebase from 'firebase/app'

const config = {
	apiKey: 'AIzaSyAdfgwTpU-R0bYN8_FWt3JWudOhQS3UF6c',
	authDomain: 'mercury-2000.firebaseapp.com',
	databaseURL: 'https://mercury-2000.firebaseio.com',
	projectId: 'mercury-2000',
	storageBucket: 'mercury-2000.appspot.com',
	messagingSenderId: '409156383659',
	appId: '1:409156383659:web:e0fc81b5225a37514f98ee',
}

!firebase.apps.length ? firebase.initializeApp(config) : firebase.app()

function App() {
	return <View style={{ flex: 1, backgroundColor: 'green' }} />
}

export default withPhoneAuth(App, {
	Loading: () => <View style={styles.container} />,
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'blue',
		alignItems: 'center',
		justifyContent: 'center',
	},
})
