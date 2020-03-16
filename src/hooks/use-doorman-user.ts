import { useDoormanContext } from '../context'
import firebase from 'firebase/app'
import { doorman } from '../methods'

const signOut = () => firebase.auth().signOut()

export function useDoormanUser() {
	const user = useDoormanContext()?.user
	if (!user) {
		console.error(
			'Error in useDoormanUser hook. User is not existent. Are you sure you wrapped your app with the withPhoneAuth higher order component or with the <AuthGate /> component?'
		)
	}

	return {
		...user,
		signOut,
		updateUserDisplayName: doorman.updateUserDisplayName,
	}
}
