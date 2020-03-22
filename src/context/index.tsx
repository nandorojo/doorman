import React, { useContext, useEffect, useReducer, useCallback } from 'react'
import { createContext, ReactNode } from 'react'
import { useFirebaseAuthGate } from '../hooks/use-firebase-auth-gate'
import { doorman, InitializationProps } from '../methods'
import { theme as themeCreator } from '../style/theme'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import { isTestPhoneNumber } from '../utils/is-test-phone-number'

type Context = null | {
	user: null | firebase.User
	loading: boolean
	theme?: ReturnType<typeof themeCreator>
	authFlowState: AuthFlowState & {
		authenticateApp: () => void
		onChangePhoneNumber: (phoneNumber: string) => void
		setCodeScreenReady: (ready: boolean) => void
	}
}

export type ProviderProps = {
	theme?: ReturnType<typeof themeCreator>
	children: ReactNode
	onAuthStateChanged?: (user: firebase.User | null) => void
	/**
	 * (Optional) The initial state of the phone number field.
	 * If you aren't based in the US, you may want to set this to the prefix of your country.
	 *
	 * Default: `+1`
	 */
	initialPhoneNumber?: string
}

const DoormanContext = createContext<Context>(null)

type AuthFlowState = {
	phoneNumber: string
	/**
	 * If true, the <AuthFlow /> component shows the Verify Code Screen.
	 */
	ready: boolean
	isValidPhoneNumber: boolean
}

type AuthFlowStateAction =
	| { type: 'UPDATE_PHONE_NUMBER'; phoneNumber: string }
	| { type: 'SET_READY'; ready: boolean }

const authFlowStateReducer = (
	state: AuthFlowState,
	action: AuthFlowStateAction
): AuthFlowState => {
	switch (action.type) {
		case 'SET_READY':
			return {
				...state,
				ready: action.ready,
			}
		case 'UPDATE_PHONE_NUMBER':
			return {
				...state,
				phoneNumber: action.phoneNumber,
				isValidPhoneNumber:
					isPossiblePhoneNumber(action.phoneNumber) ||
					isTestPhoneNumber(action.phoneNumber),
			}
		default:
			throw new Error(
				'🚨🥶 Doorman AuthFlowState reducer error. Called an inexistent action.'
			)
	}
}

/**
 * The auth flow state is handled at the root of the app.
 *
 * The `phoneNumber` prop is used always, whether someone is building a custom auth flow or not.
 *
 * The `ready` prop is only used when Doorman is handling the entire flow, via either `withPhoneAuth` or `AuthFlow`.
 *
 * This means that the phone number the user is typing, as well as the `ready` state of the flow, is available to all screens.
 *
 * The `<AuthFlow.PhoneScreen />` component will access the `phoneNumber` and `onChangePhoneNumber`. It will call `setCodeScreenReady(true)` to advance.
 */
const useCreateAuthFlowState = (props?: {
	initialPhoneNumber?: string
}): AuthFlowState & {
	authenticateApp: () => void
	onChangePhoneNumber: (phoneNumber: string) => void
	setCodeScreenReady: (ready: boolean) => void
} => {
	const [authState, dispatch] = useReducer(authFlowStateReducer, {
		phoneNumber: props?.initialPhoneNumber ?? '+1',
		ready: false,
		isValidPhoneNumber: false,
	})

	const authenticateApp = useCallback(() => {
		dispatch({ type: 'SET_READY', ready: false })
	}, [])
	const onChangePhoneNumber = useCallback((phoneNumber: string) => {
		dispatch({ type: 'UPDATE_PHONE_NUMBER', phoneNumber })
	}, [])
	const setCodeScreenReady = useCallback(
		(ready: boolean) => dispatch({ type: 'SET_READY', ready }),
		[]
	)

	return {
		...authState,
		authenticateApp,
		onChangePhoneNumber,
		setCodeScreenReady,
	}
}

export function DoormanProvider({
	children,
	publicProjectId,
	onAuthStateChanged: onAuthStateChangedProp,
	theme = themeCreator(),
}: ProviderProps & InitializationProps) {
	const authFlowState = useCreateAuthFlowState()
	const auth = useFirebaseAuthGate({
		onAuthStateChanged: user => {
			onAuthStateChangedProp?.(user)
			authFlowState.setCodeScreenReady(false)
		},
	})

	useEffect(() => {
		doorman.initialize({ publicProjectId })
	}, [publicProjectId])

	return (
		<DoormanContext.Provider value={{ ...auth, theme, authFlowState }}>
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
