import React, { ComponentType, ComponentPropsWithoutRef, useState } from 'react'
import { AuthGate } from '../components/AuthGate'
import { AuthFlow } from '../views'
import { DoormanProvider, useDoormanContext, ProviderProps } from '../context'
import { InitializationProps } from '../methods'

type Options = Omit<ProviderProps, 'children'> & {
	Loading?: ComponentType
	includeProvider?: boolean
	// tintColor?: string
	phoneScreenProps?: ComponentPropsWithoutRef<
		typeof AuthFlow
	>['phoneScreenProps']
	codeScreenProps?: ComponentPropsWithoutRef<typeof AuthFlow>['codeScreenProps']
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
		Loading,
		includeProvider = true,
		// tintColor,
		phoneScreenProps,
		codeScreenProps,
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
							return Loading ? <Loading /> : <></>
						}

						if (user) return <Component {...props} user={user} />

						if (!splashDone && SplashScreen)
							return <SplashScreen next={() => setSplashDone(true)} />

						return (
							<AuthFlow
								phoneScreenProps={phoneScreenProps}
								codeScreenProps={codeScreenProps}
							/>
						)
					}}
				</AuthGate>
			</Provider>
		)
	}
	return WithFirebasePhoneAuth
}
