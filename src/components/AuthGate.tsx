import { useDoormanContext } from '../context'

type Props = {
	children: (props: {
		loading: boolean
		user: firebase.User | null
	}) => JSX.Element
}

export function AuthGate({ children }: Props) {
	const authGate = useDoormanContext()

	return children(authGate)
}
