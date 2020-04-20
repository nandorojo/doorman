import { useDoormanContext } from '../context'
import * as firebase from 'firebase'

const signOut = () => firebase.auth().signOut()

export function useDoormanUser(): firebase.User & {
	signOut: () => Promise<void>
} {
	const user = useDoormanContext()?.user as firebase.User
	if (!user)
		throw new Error(
			'Doorman error: called the useDoormanUser hook in a component when the user was not authenticated. This hook can only be called once the user has authenticated.\n\n If you want to use this hook on a screen that does not always have a user, try the useMaybeDoormanUser() hook.'
		)
	// if (user) {
	return {
		...user,
		signOut,
	}
	// // }
	// console.error(
	// 	'Error in useDoormanUser hook. User is not existent. Are you sure you wrapped your app with the withPhoneAuth higher order component or with the <AuthGate /> component?'
	// )
	// return { user: null }
}
