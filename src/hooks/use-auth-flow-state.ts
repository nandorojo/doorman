import { useDoormanContext } from '../context'

/**
 * `useAuthFlowState`
 *
 * The auth flow state exposes the `ready` and `phoneNumber` values created by the auth flow.
 *
 * The `phoneNumber` is just whatever the user has typed in the form. It is then accessed by the code verification screen to let people know what number their text was sent to.
 *
 * Meanwhile, the `ready` prop is used only to manage the transition between the `<AuthFlow.PhoneScreen />` and `<AuthFlow.CodeScreen />`.
 *
 * If `ready` is true, it shows the code screen. Otherwise, it shows the phone screen.
 */
export const useAuthFlowState = () => {
	const context = useDoormanContext()

	if (!context) {
		throw new Error(
			'🚨🚪 Doorman error in useAuthFlowState hook. Tried to access the Doorman context, but it does not exist. This probably means your app does not have the <DoormanProvider /> at the root of it, OR that your app is not wrapped with the `withAuthFlow` function. \n\nFor more details, see the example in the Doorman docs: https://docs.doorman.cool/introduction/quick-example'
		)
	}

	return context.authFlowState
}
