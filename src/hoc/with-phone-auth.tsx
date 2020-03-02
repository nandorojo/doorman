import React, { ComponentType } from 'react'
import { AuthGate } from '../components/AuthGate'
import { Magic } from '../views/Controlled'
import { DoormanProvider, useDoormanContext } from '../context'
import { empty } from '../utils/empty'

type Options = {
	Loading?: ComponentType
	includeProvider?: boolean
	tintColor?: string
}

export function withPhoneAuth<P>(
	Component: ComponentType<P & { user: firebase.User }>,
	options: Options = empty.object
) {
	const { Loading, includeProvider = true, tintColor } = options
	const WithFirebasePhoneAuth = (props: P) => {
		/**
		 * If the context is non-null, this means a provider already exists in the component tree.
		 *
		 * In this case, we add it ourselves. You can still deny `includeProvider` if you want.
		 */
		const providerExistsAlready = useDoormanContext()
		const Provider =
			!providerExistsAlready && includeProvider
				? DoormanProvider
				: React.Fragment
		return (
			<Provider>
				<AuthGate>
					{({ loading, user }) => {
						if (loading) {
							return Loading ? <Loading /> : <></>
						}

						if (user) return <Component {...props} user={user} />

						return <Magic.PhoneStack tintColor={tintColor} />
					}}
				</AuthGate>
			</Provider>
		)
	}
	return WithFirebasePhoneAuth
}
