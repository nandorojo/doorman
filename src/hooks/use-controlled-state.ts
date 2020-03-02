import { SetStateAction, useState, Dispatch } from 'react'

type Props<T> = {
	state?: T
	setState?: Dispatch<SetStateAction<T>>
}

type Returns<T> = [T, Dispatch<SetStateAction<T>> | ((state: T) => void)]

/**
 * React hooks that lets you pass an optional state and setState function. This is useful when you sometimes control state or do it internally, but don't know which beforehand.
 *
 * The internal state is a fallback if you don't provide a state and setState argument.
 *
 * @param props array with the controlled state and setState function
 * @param initialValue optional initial value for the internal state
 */
export const useControlledOrInternalState = <T>(
	props: Props<T>,
	initialValue: T
): Returns<T> => {
	let [state, setState] = useState<T>(initialValue)
	// let finalState = state
	// let setFinalState = setState
	if (props.state !== undefined) {
		state = props.state
		if (props.setState) {
			setState = props.setState
		}
	}

	return [state, setState]
}
