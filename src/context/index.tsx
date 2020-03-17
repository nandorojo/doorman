import React, { useContext, useEffect } from 'react'
import { createContext, ReactNode } from 'react'
import { useFirebaseAuthGate } from '../hooks/use-firebase-auth-gate'
import { doorman, InitializationProps } from '../methods'
import { theme as themeCreator } from '../style/theme'

type Context = null | {
	user: null | firebase.User
	loading: boolean
	theme?: ReturnType<typeof themeCreator>
}

type Props = {
	theme?: ReturnType<typeof themeCreator>
	children: ReactNode
}

const DoormanContext = createContext<Context>(null)

export function DoormanProvider({
	children,
	publicAppId,
	theme = themeCreator(),
}: Props & InitializationProps) {
	const auth = useFirebaseAuthGate()

	useEffect(() => {
		doorman.initialize({ publicAppId })
	}, [publicAppId])

	return (
		<DoormanContext.Provider value={{ ...auth, theme }}>
			{children}
		</DoormanContext.Provider>
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
