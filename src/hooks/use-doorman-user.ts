import { useDoormanContext } from '../context'

export function useDoormanUser() {
	return useDoormanContext().user
}
