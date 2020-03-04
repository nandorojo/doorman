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
		const response: { success: boolean; error: null } = await fetch(
			getEndpoint(),
			{
				body: JSON.stringify({
					phone: info.phoneNumber,
					action: Constants.signIn,
				}),
				method: 'POST',
			}
		).then(r => r.json())
		return response
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
}): Promise<{ token: string | null; success: boolean; uid?: string }> => {
	try {
		if (!configuration.hasInitialized) {
			throw new Error(InitializationErrorMessage)
		}
		const response: Promise<{ token: string; uid: string }> = await fetch(
			getEndpoint(),
			{
				body: JSON.stringify({
					code,
					phone,
					action: Constants.verify,
				}),
				method: 'POST',
			}
		).then(res => res.json())
		return { success: true, token: (await response).token }
	} catch (e) {
		console.error('Error using verifyToken: ', e)
		return { token: null, success: false }
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
