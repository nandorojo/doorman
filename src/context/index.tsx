import React, { useContext, useEffect } from 'react'
import { createContext, ReactNode } from 'react'
import { useFirebaseAuthGate } from '../hooks/use-firebase-auth-gate'
import { doorman, InitializationProps } from '../methods'

type Context = null | {
	user: null | firebase.User
	loading: boolean
}

const DoormanContext = createContext<Context>(null)

export function DoormanProvider({
	children,
	projectId,
}: {
	children: ReactNode
} & InitializationProps) {
	const auth = useFirebaseAuthGate()

	useEffect(() => {
		doorman.initialize({ projectId })
	}, [projectId])

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
