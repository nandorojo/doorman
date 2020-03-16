import { useReducer, useCallback } from 'react'

type State<E extends string = string> = {
	loading: boolean
	error: E | null
}

type Action<E> =
	| {
			type: 'start loading' | 'stop loading' | 'clear error'
	  }
	| {
			type: 'new error'
			error: E
	  }

const createReducer = <E extends string = string>() => (
	state: State<E>,
	action: Action<E>
): State<E> => {
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

export const useNetworkReducer = <E extends string = string>(
	state?: State<E>
) => {
	const [s, dispatch] = useReducer(
		createReducer<E>(),
		state ?? {
			loading: false,
			error: null,
		}
	)
	const { loading, error } = s
	const setLoading = useCallback(
		(loading: boolean) =>
			dispatch({ type: loading ? 'start loading' : 'stop loading' }),
		[dispatch]
	)
	const setError = useCallback(
		(error: E | null) =>
			error
				? dispatch({ type: 'new error', error })
				: dispatch({ type: 'clear error' }),
		[dispatch]
	)

	return {
		loading,
		error,
		setLoading,
		setError,
		dispatch,
	}
}
