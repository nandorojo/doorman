import { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

export function useFirebaseAuthGate() {
	const [user, setUser] = useState<firebase.User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = firebase.auth().onIdTokenChanged(auth => {
			setUser(auth)
			setLoading(false)
		})
		return () => unsubscribe()
	}, [])

	return { user, loading }
}
