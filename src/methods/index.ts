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
	endpoint: 'https://expophone.com',
}

function configurationHasKey(config: Configuration): config is Initialized {
	return !!(config as Initialized).hasInitialized
}

const Constants = {
	signIn: 'signIn',
	verify: 'verify',
}

export const initialize = ({ key }: { key: string }) => {
	configuration = {
		...configuration,
		key,
		hasInitialized: true,
	}
}

export const initializeWithCustomEndpoint = (endpoint: string) => {
	configuration = {
		...configuration,
		hasInitialized: true,
		endpoint,
	}
}

const getEndpoint = (ending?: string) => {
	if (configurationHasKey(configuration)) {
		return `${configuration.endpoint}/${configuration.key}/${ending ?? ''}`
	} else {
		return `${configuration.endpoint}/${ending ?? ''}`
	}
}

export const signInWithPhoneNumber = async (info: { phoneNumber: string }) => {
	try {
		if (!configuration.hasInitialized) {
			throw new Error(
				'initialize() or initializeWithCustomEndpoint() method was never called. Call one of these functions at the root of your app, usually in App.js, to use phone auth.'
			)
		}
		const response: { success: boolean; error: null } = await fetch(
			`${getEndpoint(Constants.signIn)}`,
			{
				body: JSON.stringify({
					phoneNumber: info.phoneNumber,
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

export const verifyCode = async ({
	code,
	phoneNumber,
}: {
	code: string
	phoneNumber: string
}): Promise<{ token: string | null; success?: boolean; uid: string }> => {
	try {
		if (!configuration.hasInitialized) {
			throw new Error(
				'initialize() or initializeWithCustomEndpoint() method was never called. Call one of these functions at the root of your app, usually in App.js, to use phone auth.'
			)
		}
		const response: Promise<{ token: string }> = await fetch(
			`${getEndpoint(Constants.verify)}`,
			{
				body: JSON.stringify({
					code,
					phoneNumber,
				}),
				method: 'POST',
			}
		).then(res => res.json())
		return response
	} catch (e) {
		console.error('Error using verifyToken: ', e)
		return { token: null, success: false }
	}
}
