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
	publicProjectId: string
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
		!!(config as Initialized).publicProjectId
	)
}

const Constants = {
	signIn: 'loginWithPhone',
	verify: 'verifyCode',
	error: 'error',
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
		'Tried to call doorman before it was initialized. Make sure to either use the Doorman withPhoneAuth HOC at the root of your app, wrap your app with the <DoormanProvider>, or run doorman.initialize() at the root of your app before any render code.\n\nYou must initialize the app with your Public Project ID, found on your Doorman dashboard.'
	)
}
const post = (body: object) =>
	fetch(getEndpoint(), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	}).then(r => r.json())

const uploadError = (message: string) => {
	return post({
		publicProjectId:
			configuration.hasInitialized && configuration.publicProjectId,
		message: `🚨react-native-doorman Error. ${message}`,
	})
}

const initialize = ({
	publicProjectId,
	firebaseConfig,
}: {
	firebaseConfig?: Parameters<typeof initializeApp>['0']
} & InitializationProps) => {
	configuration = {
		...configuration,
		hasInitialized: true,
		publicProjectId,
	}
	if (firebaseConfig) {
		return !firebase.apps.length
			? firebase.initializeApp(firebaseConfig).firestore()
			: firebase.app().firestore()
	}
	return null
}

const signInWithPhoneNumber = async ({
	phoneNumber,
}: {
	phoneNumber: string
}) => {
	try {
		if (!configuration.hasInitialized) {
			throw new Error(InitializationErrorMessage)
		}
		const {
			message,
			success,
		}: {
			success: boolean
			message?: 'custom/code-does-not-match'
		} = await post({
			phoneNumber,
			action: Constants.signIn,
			publicProjectId: configuration.publicProjectId,
		})

		if (message) {
			uploadError(`${Constants.signIn}: ${message}`)
			throw new Error(message)
		}
		if (!success) {
			uploadError(
				`${Constants.signIn}: success was false, but there was no message.`
			)
			console.warn(
				'Warning: success was false for sending SMS, but there was no error message. If you are using test numbers and everything still worked, you can disregard this warning.'
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
	phoneNumber,
}: {
	code: string
	phoneNumber: string
}): Promise<{ token: string | null; success: boolean; error?: string }> => {
	try {
		if (!configuration.hasInitialized) {
			throw new Error(InitializationErrorMessage)
		}
		const { token, message }: { token: string; message?: string } = await post({
			code,
			phoneNumber,
			action: Constants.verify,
			publicProjectId: configuration.publicProjectId,
		})
		if (!token) {
			uploadError(`${Constants.verify}: Missing token. ${message}`)
			throw new Error(message)
		}
		return { success: true, token }
	} catch (e) {
		console.error('Error using Doorman function verifyCode: ', e)
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
