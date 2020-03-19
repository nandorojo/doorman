import { useDoormanContext } from '../context'
import { PackageName } from '../constants'

type Props = {
	children: (props: {
		loading: boolean
		user: firebase.User | null
	}) => JSX.Element
}

export function AuthGate({ children }: Props) {
	const authGate = useDoormanContext()

	if (authGate) {
		return children(authGate)
	}

	console.error(`💩 ${PackageName} error:

Tried to use <AuthGate> component before initializing app with the <${PackageName}Provider /> component before it.

Make sure to put the provider at the root of your app.
	`)
	return null
}
