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

type NotInitialized = {
	hasInitialized: false
}

export type InitializationProps = {
	publicAppId: string
}

type Initialized = InitializationProps & {
	hasInitialized: true
}

type Configuration = NotInitialized | Initialized

let configuration: Configuration = {
	hasInitialized: false,
}

const UsersCollection = '__DOORMAN_USERS'

function configurationHasKey(config: Configuration): config is Initialized {
	return (
		!!(config as Initialized).hasInitialized &&
		!!(config as Initialized).publicAppId
	)
}

const Constants = {
	signIn: 'loginWithPhone',
	verify: 'verifyCode',
}

// const getEndpoint = (ending?: string) => {
// 	if (configurationHasKey(configuration) && configuration.endpoint) {
// 		return `${configuration.endpoint}/${ending ?? ''}`
// 	} else {
// 		return console.error(InitializationErrorMessage, { error: 'no endpoint' })
// 	}
// }

const getEndpoint = () => {
	if (configurationHasKey(configuration))
		return `https://sending-messages-for-doorman.herokuapp.com/phoneLogic`
	throw new Error(
		'Tried to call doorman before it was initialized. Make sure to either use the Doorman withPhoneAuth HOC at the root of your app, wrap your app with the <DoormanProvider>, or run doorman.initialize() at the root of your app before any render code.\n\nYou must initialize the app with your Public App ID, found on your Doorman dashboard.'
	)
}
const post = (body: object) =>
	fetch(getEndpoint(), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	}).then(r => r.json())

const initialize = ({
	publicAppId,
	firebaseConfig,
}: {
	firebaseConfig?: Parameters<typeof initializeApp>['0']
} & InitializationProps) => {
	configuration = {
		...configuration,
		hasInitialized: true,
		publicAppId,
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
		const {
			error,
			success,
		}: { success: boolean; error?: 'custom/code-does-not-match' } = await post({
			phone: info.phoneNumber,
			action: Constants.signIn,
			accountId: configuration.publicAppId,
		})

		if (error) throw new Error(error)
		if (!success) {
			console.warn(
				'Warning: success was false for sending SMS, but there was no error message. If you are using test numbers, disregard this warning.'
			)
		}
		return { success: true }
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
			accountId: configuration.publicAppId,
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

const updateUserDisplayName = async ({
	displayName,
}: {
	displayName: string
}) => {
	return firebase.auth().currentUser?.updateProfile({ displayName })
}

export const doorman = {
	initialize,
	signInWithPhoneNumber,
	verifyCode,
	doesUserExist,
	addUserToDb,
	getUser,
	updateUserDisplayName,
}
