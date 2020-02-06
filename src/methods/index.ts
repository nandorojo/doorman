interface NotInitialized {
	hasInitialized: false
	endpoint: string
}

interface Initialized {
	hasInitialized: true
	key: string
	endpoint: string
}

interface InitializedWithCustomEndpoint {
	hasInitialized: true
	endpoint: string
}

type Configuration =
	| NotInitialized
	| Initialized
	| InitializedWithCustomEndpoint

let configuration: Configuration = {
	hasInitialized: false,
	endpoint: 'https://expophone.com'
}

function configurationHasKey(config: Configuration): config is Initialized {
	return !!(config as Initialized).hasInitialized
}

const Constants = {
	signIn: 'signIn',
	verify: 'verify'
}

export const initialize = (config: { key: string }) => {
	configuration = {
		...configuration,
		key: config.key,
		hasInitialized: true
	}
}

export const initializeWithCustomEndpoint = (endpoint: string) => {
	configuration = {
		...configuration,
		hasInitialized: true,
		endpoint
	}
}

const getEndpoint = (ending?: string) => {
	if (configurationHasKey(configuration)) {
		return `${configuration.endpoint}/${configuration.key}/${ending || ''}`
	} else {
		return `${configuration.endpoint}/${ending || ''}`
	}
}

export const signInWithPhoneNumber = async (info: { phoneNumber: string }) => {
	try {
		if (!configuration.hasInitialized) {
			throw new Error(
				'initialize() or initializeWithCustomEndpoint() method was never called. Call one of these functions at the root of your app, usually in App.js, to use phone auth.'
			)
		}
		return fetch(`${getEndpoint(Constants.signIn)}`, {
			body: JSON.stringify({
				phoneNumber: info.phoneNumber
			}),
			method: 'POST'
		})
	} catch (e) {
		console.error('Error using signInWithPhoneNumber: ', e)
		return { error: e }
	}
}

export const verifyToken = async (info: { token: string }) => {
	try {
		if (!configuration.hasInitialized) {
			throw new Error(
				'initialize() or initializeWithCustomEndpoint() method was never called. Call one of these functions at the root of your app, usually in App.js, to use phone auth.'
			)
		}
		return fetch(`${getEndpoint(Constants.verify)}`, {
			body: JSON.stringify({
				token: info.token
			}),
			method: 'POST'
		})
	} catch (e) {
		console.error('Error using verifyToken: ', e)
		return { error: e }
	}
}
