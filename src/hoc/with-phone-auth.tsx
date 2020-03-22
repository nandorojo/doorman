import React, { ComponentType, ComponentPropsWithoutRef, useState } from 'react'
import { AuthGate } from '../components/AuthGate'
import { AuthFlow } from '../views'
import { DoormanProvider, useDoormanContext, ProviderProps } from '../context'
import { InitializationProps } from '../methods'

type Options = Omit<ProviderProps, 'children'> & {
	LoadingScreen?: ComponentType
	includeProvider?: boolean
	// tintColor?: string
	phoneScreenProps?: ComponentPropsWithoutRef<
		typeof AuthFlow
	>['phoneScreenProps']
	confirmScreenProps?: ComponentPropsWithoutRef<
		typeof AuthFlow
	>['confirmScreenProps']
	/**
	 * **Required:** Your app's config for doorman.
	 *
	 * ```javascript
	 * {
	 *  projectId: string // projectId from firebase
	 * }
	 * ```
	 */
	doorman: InitializationProps
	/**
	 * (Optional) Your custom splash screen component that will appear before any auth screens are shown.
	 *
	 * It receives one prop: a function called `next` that should be called whenever a user wants to continue to the auth screens.
	 */
	SplashScreen?: ComponentType<{ next: () => void }>
}

export function withPhoneAuth<P>(
	Component: ComponentType<P & { user: firebase.User }>,
	options: Options
) {
	// return () => null

	const {
		LoadingScreen,
		includeProvider = true,
		// tintColor,
		phoneScreenProps,
		confirmScreenProps,
		doorman,
		SplashScreen,
		theme: themeOption,
		initialPhoneNumber,
		onAuthStateChanged,
	} = options
	const WithFirebasePhoneAuth = (props: P) => {
		const [splashDone, setSplashDone] = useState(!SplashScreen)

		/**
		 * If the context is non-null, this means a provider already exists in the component tree.
		 *
		 * If it doesn't, we add it ourselves. You can still deny `includeProvider` if you want.
		 */
		const providerExistsAlready = useDoormanContext()
		const Provider =
			!providerExistsAlready && includeProvider
				? DoormanProvider
				: React.Fragment
		return (
			<Provider
				onAuthStateChanged={onAuthStateChanged}
				initialPhoneNumber={initialPhoneNumber}
				theme={themeOption}
				{...doorman}
			>
				<AuthGate>
					{({ loading, user }) => {
						if (loading) {
							return LoadingScreen ? <LoadingScreen /> : <></>
						}

						if (user) return <Component {...props} user={user} />

						if (!splashDone && SplashScreen)
							return <SplashScreen next={() => setSplashDone(true)} />

						return (
							<AuthFlow
								phoneScreenProps={phoneScreenProps}
								confirmScreenProps={confirmScreenProps}
							/>
						)
					}}
				</AuthGate>
			</Provider>
		)
	}
	return WithFirebasePhoneAuth
}
