import { useDoormanContext } from '../context'

export const useAuthGate = () => {
	const authGate = useDoormanContext()

	if (!authGate) {
		throw new Error(
			'👋Doorman useAuthGate hook error. useAuthGate was called in a component before the Doorman context was created. \n\nMake sure that your app is wrapped with DoormanProvider or withPhoneAuth.'
		)
	}

	return {
		loading: authGate.loading,
		user: authGate.user,
	}
}
