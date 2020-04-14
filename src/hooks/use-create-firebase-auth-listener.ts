import { useState, useEffect, useRef } from 'react'
import * as firebase from 'firebase'
import { empty } from '../utils/empty'

type Props = {
	onAuthStateChanged?: (user: firebase.User | null) => void
}

export function useCreateFirebaseAuthListener(
	{ onAuthStateChanged }: Props = empty.object
) {
	const [user, setUser] = useState<firebase.User | null>(null)
	const [loading, setLoading] = useState(true)

	const callback = useRef(onAuthStateChanged)
	useEffect(() => {
		callback.current = onAuthStateChanged
	})

	useEffect(() => {
		const unsubscribe = firebase.auth().onIdTokenChanged(auth => {
			callback.current?.(auth)
			setUser(auth)
			setLoading(false)
		})
		return () => unsubscribe()
	}, [])

	return { user, loading }
}
