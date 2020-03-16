import React, { ComponentType, ComponentPropsWithoutRef, useState } from 'react'
import { AuthGate } from '../components/AuthGate'
import { Magic } from '../views/Controlled'
import { DoormanProvider, useDoormanContext } from '../context'
import { InitializationProps } from '../methods'
import { theme } from '../style/theme'

type Options = {
	Loading?: ComponentType
	includeProvider?: boolean
	tintColor?: string
	phoneScreenProps?: ComponentPropsWithoutRef<
		typeof Magic['PhoneAuthStack']
	>['phoneScreenProps']
	codeScreenProps?: ComponentPropsWithoutRef<
		typeof Magic['PhoneAuthStack']
	>['codeScreenProps']
	/**
	 * Endpoint provided to you by doorman.
	 */
	testNumbers?: string[]
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
	theme?: ReturnType<typeof theme>
}

export function withPhoneAuth<P>(
	Component: ComponentType<P & { user: firebase.User }>,
	options: Options
) {
	console.log('HOCCCC?')
	// return () => null

	const {
		Loading,
		includeProvider = true,
		tintColor,
		phoneScreenProps,
		codeScreenProps,
		doorman,
		testNumbers,
		SplashScreen,
		theme: themeOption,
	} = options
	const WithFirebasePhoneAuth = (props: P) => {
		console.log('IN WITH PHONE AUTH HOC??')
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
			<Provider theme={themeOption} {...doorman}>
				<AuthGate>
					{({ loading, user }) => {
						if (loading) {
							return Loading ? <Loading /> : <></>
						}

						if (user) return <Component {...props} user={user} />

						if (!splashDone && SplashScreen)
							return <SplashScreen next={() => setSplashDone(true)} />

						return (
							<Magic.PhoneAuthStack
								{...{
									phoneScreenProps,
									codeScreenProps,
									tintColor,
									testNumbers,
								}}
							/>
						)
					}}
				</AuthGate>
			</Provider>
		)
	}
	return WithFirebasePhoneAuth
}
