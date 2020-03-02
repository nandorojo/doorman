import React, { useContext } from 'react'
import { createContext, ReactNode } from 'react'
import { useFirebaseAuthGate } from '../hooks/use-firebase-auth-gate'

type Context = {
	user: null | firebase.User
	loading: boolean
}

const DoormanContext = createContext<Context>({
	user: null,
	loading: false,
})

export function DoormanProvider({ children }: { children: ReactNode }) {
	const auth = useFirebaseAuthGate()

	return (
		<DoormanContext.Provider value={auth}>{children}</DoormanContext.Provider>
	)
}

export function Doorman({
	children,
}: {
	children: (context: Context) => ReactNode
}) {
	return <DoormanContext.Consumer>{children}</DoormanContext.Consumer>
}

export function useDoormanContext() {
	return useContext(DoormanContext)
}
