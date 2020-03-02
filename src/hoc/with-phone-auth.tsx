import React, { ComponentType } from 'react'
import { AuthGate } from '../components/AuthGate'
import { Magic } from '../views/Controlled'
import { DoormanProvider } from '../context'
import { empty } from '../utils/empty'

type Options = {
	Loading?: ComponentType
	includeProvider?: boolean
}

export function withPhoneAuth<P>(
	Component: ComponentType<P>,
	options: Options = empty.object
) {
	const { Loading, includeProvider = true } = options
	const WithFirebasePhoneAuth = (props: P) => {
		const Provider = includeProvider ? DoormanProvider : React.Fragment
		return (
			<Provider>
				<AuthGate>
					{({ loading, user }) => {
						if (loading) {
							return Loading ? <Loading /> : <></>
						}

						if (user) return <Component {...props} />

						return <Magic.PhoneStack />
					}}
				</AuthGate>
			</Provider>
		)
	}
	return WithFirebasePhoneAuth
}
