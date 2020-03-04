import { useReducer } from 'react'

type State<Error> = {
	loading: boolean
	error: null | Error
}

const initialState: State<Error> = {
	loading: false,
	error: null,
}

type Action<Error> =
	| {
			type: 'start loading' | 'stop loading' | 'clear error'
	  }
	| {
			type: 'new error'
			error: Error
	  }

const reducer = <Error = string>(
	state: State<Error>,
	action: Action<Error>
): State<Error> => {
	switch (action.type) {
		case 'clear error':
			return {
				...state,
				error: null,
			}
		case 'new error':
			return {
				...state,
				error: action.error,
			}
		case 'start loading':
			return {
				...state,
				loading: true,
			}
		case 'stop loading':
			return {
				...state,
				loading: false,
			}
		default:
			return state
	}
}

export const useNetworkReducer = <Error>(state?: State<Error>) => {
	const [{ loading, error }, dispatch] = useReducer(
		reducer,
		state ?? initialState
	)
	const setLoading = (loading: boolean) =>
		dispatch({ type: loading ? 'start loading' : 'stop loading' })
	const setError = (error: Error | null) =>
		error
			? dispatch({ type: 'new error', error })
			: dispatch({ type: 'clear error' })

	return {
		loading,
		error,
		setLoading,
		setError,
		dispatch,
	}
}
