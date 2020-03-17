import { useDoormanContext } from '../context/'
import { theme } from '../style/theme'

export const useDoormanTheme = () => {
	const context = useDoormanContext()

	if (!context) {
		console.error(
			'Doorman context requested without the Provider initialized. Make sure to wrap the root of your app with the Doorman provider component.'
		)
	}

	return context?.theme ?? theme()
}
