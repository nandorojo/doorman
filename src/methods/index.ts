import { PackageName, npmPackageName } from '../constants/index'
import firebase from 'firebase/app'
require('firebase/firestore')

const { initializeApp } = firebase

const InitializationErrorMessage = `

${PackageName} not properly initialized. Make sure you have code like this in your main App.js file:

import { doorman } from '${npmPackageName}'

doorman.initialize({
	endpoint: ENDPOINT_YOU_GOT_FROM_DOORMAN_CLI
})

or give the endpoint to your <DoormanProvider /> component at the root of your app. 
`

interface NotInitialized {
	hasInitialized: false
}

interface Initialized {
	hasInitialized: true
	endpoint: string
}

type Configuration = NotInitialized | Initialized

let configuration: Configuration = {
	hasInitialized: false,
}

const UsersCollection = '__DOORMAN_USERS'

function configurationHasKey(config: Configuration): config is Initialized {
	return !!(config as Initialized).hasInitialized
}

const Constants = {
	signIn: 'logInWithPhoneNumber',
	verify: 'verifyToken',
}

// const getEndpoint = (ending?: string) => {
// 	if (configurationHasKey(configuration) && configuration.endpoint) {
// 		return `${configuration.endpoint}/${ending ?? ''}`
// 	} else {
// 		return console.error(InitializationErrorMessage, { error: 'no endpoint' })
// 	}
// }

const getEndpoint = () =>
	configurationHasKey(configuration) ? configuration.endpoint : ''

const post = (body: object) =>
	fetch(getEndpoint(), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	}).then(r => r.json())

const initialize = ({
	endpoint,
	firebaseConfig,
}: {
	endpoint: string
	firebaseConfig?: Parameters<typeof initializeApp>['0']
}) => {
	configuration = {
		...configuration,
		hasInitialized: true,
		endpoint,
	}
	if (firebaseConfig) {
		return !firebase.apps.length
			? firebase.initializeApp(firebaseConfig).firestore()
			: firebase.app().firestore()
	}
	return null
}

const signInWithPhoneNumber = async (info: { phoneNumber: string }) => {
	try {
		if (!configuration.hasInitialized) {
			throw new Error(InitializationErrorMessage)
		}
		const { error, success }: { success: boolean; error?: string } = await post(
			{
				phone: info.phoneNumber,
				action: Constants.signIn,
			}
		)

		if (error) throw new Error(error)
		if (!success) {
			throw new Error(
				'unknown error: success was false but there was no error message'
			)
		}
		return { success }
	} catch (e) {
		console.error('Error using signInWithPhoneNumber: ', e)
		return { error: e, success: false }
	}
}

const verifyCode = async ({
	code,
	phoneNumber: phone,
}: {
	code: string
	phoneNumber: string
}): Promise<{ token: string | null; success: boolean; error?: string }> => {
	try {
		if (!configuration.hasInitialized) {
			throw new Error(InitializationErrorMessage)
		}
		const { token, error }: { token: string; error?: string } = await post({
			code,
			phone,
			action: Constants.verify,
		})
		if (!token) throw new Error(error)
		return { success: true, token }
	} catch (e) {
		console.error('Error using verifyToken: ', e)
		return { token: null, success: false, error: e }
	}
}

const doesUserExist = async (user: { uid: string }) => {
	return await firebase
		.firestore()
		.collection(UsersCollection)
		.doc(user.uid)
		.get()
		.then(doc => doc.exists)
}

const addUserToDb = async (user: firebase.User) => {
	return await firebase
		.firestore()
		.collection(UsersCollection)
		.doc(user.uid)
		.set(user, { merge: true })
}

const getUser = async (user: { uid: string }) => {
	return await firebase
		.firestore()
		.collection(UsersCollection)
		.doc(user.uid)
		.get()
		.then(doc => doc.data())
}

export const doorman = {
	initialize,
	signInWithPhoneNumber,
	verifyCode,
	doesUserExist,
	addUserToDb,
	getUser,
}
